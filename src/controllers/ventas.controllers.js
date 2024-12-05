import { Venta } from '../models/Venta.js';
import { Ganado } from '../models/Ganado.js';  // Importamos el modelo de Ganado para relacionarlo con la venta
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtener la ruta al directorio actual
const __filename = fileURLToPath(import.meta.url); // Convierte la URL a la ruta del archivo
const __dirname = dirname(__filename); // Obtiene el directorio del archivo actual

// Cambiar el estado de la venta
export const cambiarStatusVenta = async (req, res) => {
  try {
    const ventaId = req.params.id; // Obtener el ID de la venta de la URL

    // Buscar la venta por ID
    const venta = await Venta.findById(ventaId);

    if (!venta) {
      return res.status(404).send('Venta no encontrada');
    }

    // Cambiar el estado de la venta
    venta.status = (venta.status === 'Pendiente') ? 'Pagado' : 'Pendiente';

    // Guardar los cambios
    await venta.save();

    // Redirigir a la vista de ventas
    res.redirect('/ventas');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar el estado de la venta');
  }
};


// Renderizar todas las ventas con filtro de estado
export const renderVentas = async (req, res) => {
  try {
    const { status } = req.query;  // Obtener el parámetro 'status' desde la query string

    // Construir la consulta para filtrar las ventas si se especifica un estado
    let query = {};
    if (status) {
      query.status = status;  // Filtramos por el estado 'Pendiente' o 'Pagado'
    }

    // Obtenemos las ventas aplicando el filtro
    const ventas = await Venta.find(query)
      .populate('ganado')  // Poblamos el campo ganado
      .lean();  // Usamos .lean() para obtener datos sin la funcionalidad de Mongoose Document

    // Formatear las fechas y calcular el estado del botón
    ventas.forEach(venta => {
      const formattedDate = new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(venta.saleDate));
      venta.saleDateFormatted = formattedDate;
      venta.isPendiente = venta.status === 'Pendiente';  // Agregar propiedad isPendiente
    });

    // Renderizamos la vista con las ventas filtradas
    res.render('ventas/all-ventas', { ventas, status });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener las ventas');
  }
};

  

// Crear nueva venta
export const createVenta = async (req, res) => {
    try {
      const { reemo, ganado, totalAmount, customer, status } = req.body;
  
      // Convertir la lista de números de arete (separados por comas) en un array de strings
      const ganadoArray = ganado.split(',').map((earTag) => earTag.trim());
  
      // Verificar que no haya números de arete vacíos o nulos
      if (ganadoArray.some(earTag => !earTag)) {
        return res.status(400).send('Todos los números de arete deben ser válidos');
      }
  
      // Crear la venta con los números de arete
      const nuevaVenta = new Venta({
        reemo,  // ID de la recepción de ganado
        ganado: ganadoArray,  // Guardamos solo los números de arete
        totalAmount,
        customer,
        status,
        saleDate: new Date(),
      });
  
      await nuevaVenta.save();
      res.redirect('/ventas'); // Redirigir al listado de ventas
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al crear la venta');
    }
  };
  
  
// Obtener detalles de la venta específica
export const renderVenta = async (req, res) => {
    try {
      // Obtener la venta por ID
      const venta = await Venta.findById(req.params.id).lean();

          // Formatear la fecha de la venta en formato dd-mm-yyyy
      const formattedDate = new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(venta.saleDate));  // Convertimos la fecha en formato dd-mm-yyyy
      venta.saleDateFormatted = formattedDate;  // Asignamos la fecha formateada
  
      // Obtener los números de arete de los animales vendidos desde el campo "ganado" de la venta
      const earTags = venta.ganado; // Este es el array con los números de arete
  
      // Buscar en la colección "Ganado" todos los animales cuyo "earTag" esté en el array de "ganado"
      const ganadoDetalles = await Ganado.aggregate([
        {
          $unwind: "$ganado" // Descompone el array "ganado" en documentos individuales
        },
        {
          $match: { "ganado.earTag": { $in: earTags } } // Filtra por los números de arete
        },
        {
          $project: { // Proyecta solo los campos necesarios
            "ganado.earTag": 1,
            "ganado.price": 1,
            "ganado.weight": 1,
            "ganado.classification": 1
          }
        }
      ]);
  
      // Asegúrate de que los detalles del ganado se han agregado correctamente a la venta
      console.log(ganadoDetalles);
  
      // Agregar los detalles del ganado a la venta para renderizarlo en la vista
      venta.ganado = ganadoDetalles.map(item => item.ganado);
  
      // Renderizar la vista con los detalles de la venta y los animales asociados
      res.render('ventas/view-venta', { venta });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener los detalles de la venta');
    }
  };
  

  // Función para generar el PDF
  export const downloadVentaPDF = async (req, res) => {
    try {
      // Obtener la venta por ID
      const venta = await Venta.findById(req.params.id).lean();
  
      // Obtener los números de arete de los animales vendidos desde el campo "ganado" de la venta
      const earTags = venta.ganado; // Este es el array con los números de arete
  
      // Buscar en la colección "Ganado" todos los animales cuyo "earTag" esté en el array de "ganado"
      const ganadoDetalles = await Ganado.aggregate([
        {
          $unwind: "$ganado" // Descompone el array "ganado" en documentos individuales
        },
        {
          $match: { "ganado.earTag": { $in: earTags } } // Filtra por los números de arete
        },
        {
          $project: { // Proyecta solo los campos necesarios
            "ganado.earTag": 1,
            "ganado.weight": 1,
            "ganado.classification": 1
          }
        }
      ]);
  
      // Agregar los detalles del ganado a la venta
      venta.ganado = ganadoDetalles.map(item => item.ganado);
  
      // Crear el documento PDF
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=venta_${venta.reemo}.pdf`);
  
      doc.pipe(res); // Pipe the output to the response
  
      // Agregar el logo en la parte superior izquierda
      const logoPath = `${__dirname}../../public/img/LogoGanaderia.jpg`; // Ruta del logo usando __dirname
      doc.image(logoPath, 30, 30, { width: 100 }); // (x, y, opciones)
  
      // Agregar contenido al PDF
      doc.fontSize(18).text('Detalles de la Venta', { align: 'center' });
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
  
      // Información de la venta
      doc.font('Helvetica-Bold').fontSize(12).text('Reemo:', { continued: true });
      doc.font('Helvetica').text(` ${venta.reemo}`);  // Aquí el valor sigue en la fuente normal
  
      doc.font('Helvetica-Bold').text('Cliente:', { continued: true });
      doc.font('Helvetica').text(` ${venta.customer}`);
  
      doc.font('Helvetica-Bold').text('Total de la Venta:', { continued: true });
      doc.font('Helvetica').text(` $${venta.totalAmount}`);
  
      doc.font('Helvetica-Bold').text('Estado de Pago:', { continued: true });
      doc.font('Helvetica').text(` ${venta.status}`);
  
      doc.font('Helvetica-Bold').text('Fecha de Venta:', { continued: true });
      doc.font('Helvetica').text(` ${new Date(venta.saleDate).toLocaleDateString()}`);
  
      doc.moveDown();
  
      // Detalles del ganado (tabla)
      const startX = 50; // Coordenada X para empezar la tabla
      let startY = doc.y; // Coordenada Y donde empieza la tabla
      const tableWidth = 500; // Ancho total de la tabla
      const columnWidths = [150, 150, 200]; // Nuevos anchos de las columnas (sin precio)
  
      // Encabezados de la tabla (sin la columna de precio)
      doc.fontSize(14).font('Helvetica-Bold').text('Num Arete', startX, startY);
      doc.text('Peso', startX + columnWidths[0], startY);
      doc.text('Clasificación', startX + columnWidths[0] + columnWidths[1], startY);
      startY += 20; // Espaciado entre el encabezado y las filas
  
      // Línea de separación
      doc.moveTo(startX, startY).lineTo(startX + tableWidth, startY).stroke();
      startY += 5;
  
      // Detalles de cada animal (filas de la tabla)
      doc.fontSize(12).font('Helvetica');
  
      venta.ganado.forEach((animal) => {
        doc.text(animal.earTag, startX, startY);
        doc.text(`${animal.weight} Kgs`, startX + columnWidths[0], startY);
        doc.text(animal.classification, startX + columnWidths[0] + columnWidths[1], startY);
  
        startY += 20; // Espaciado entre las filas
  
        // Línea de separación entre filas
        doc.moveTo(startX, startY).lineTo(startX + tableWidth, startY).stroke();
        startY += 5;
      });
  
      // Finalizar el documento PDF
      doc.end();
  
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al generar el PDF');
    }
  };
  
  