import { Ganado } from '../models/Ganado.js';
import { Ganadero } from '../models/Ganadero.js';

export const FormularioRecepcion = async (req, res) => {
  try {
    // Obtener todos los ganaderos de la base de datos
    const ganaderos = await Ganadero.find().lean();
    // Pasar los ganaderos a la vista
    res.render('ganado/add', { ganaderos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los ganaderos');
  }
};


// Crear recepción de ganado (Paso 1)
export const createRecepcionGanado = async (req, res) => {
    const { reemo, motivo, arrivalDate, origin, destino, separacion } = req.body;
    try {
        const recepcion = new Ganado({
            reemo,
            motivo,
            arrivalDate,
            origin,
            destino,
            separacion,
            ganado: [] // Inicializamos el array vacío para los animales
        });
        // Guardar los cambios en la base de datos
        await recepcion.save();
        // Redirigir a la página donde se agregarán los animales
        res.redirect(`/ganado/addAnimales/${recepcion._id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al guardar la recepción de ganado");
    }
};
// Función para mostrar el formulario de agregar animales (Paso 2)
export const showAddAnimalesForm = async (req, res) => {
    const { reemo } = req.params;  // Obtener el parámetro reemo de la URL

    try {
        // Buscar la recepción por su ID
        const recepcion = await Ganado.findById(reemo);

        // Si no se encuentra la recepción, puedes manejarlo aquí
        if (!recepcion) {
            return res.status(404).send('Recepción no encontrada');
        }

        // Renderizar la vista 'ganado/addAnimales' pasando el ID de la recepción
        res.render('ganado/addAnimales', { recepcionId: reemo });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar la página de agregar animales");
    }
};

// Agregar animales a una recepción de ganado (Paso 2)
export const addAnimales = async (req, res) => {
    const { reemo } = req.params; // ID de la recepción de ganado
    const { earTag, sex, age, weight, price, healthStatus } = req.body;

    let classification;  // Definir la variable para clasificación

    // Determinar la clasificación en función de la edad
    if (age >= 1 && age <= 15) {
        classification = "Becerro/Becerra";
    } else if (age >= 16 && age <= 24) {
        classification = "Torete/Vacona";
    } else if (age >= 25) {
        classification = "Toro/Vaca";
    }

    try {
        const recepcion = await Ganado.findById(reemo); // Buscar la recepción de ganado por ID

        // Agregar el animal al array de ganado
        recepcion.ganado.push({
            earTag,
            sex,
            age,
            classification,
            weight,
            price,
            healthStatus
        });

        // Guardar los cambios en la base de datos
        await recepcion.save();

        // Redirigir de nuevo a la página para agregar más animales o a la lista final
        res.redirect(`/ganado/addAnimales/${recepcion._id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al agregar el animal");
    }
};

// Guardar la recepción completa
export const saveRecepcion = async (req, res) => {
    const { reemo } = req.params; // ID de la recepción de ganado

    try {
        const recepcion = await Ganado.findById(reemo); // Buscar la recepción de ganado

        // Si ya hay animales, se puede proceder a guardar la recepción como finalizada.
        if (recepcion.ganado.length > 0) {
            await recepcion.save();
            res.redirect('/ganado/list'); // Redirigir a la lista de ganados
        } else {
            res.status(400).send("No hay animales registrados en la recepción");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al guardar la recepción");
    }
};

// Mostrar todas las recepciones de ganado
export const listRecepciones = async (req, res) => {
    try {
        const { separacion } = req.query;  // Obtener el valor del filtro desde la query string

        let query = {};
        
        // Si se especifica un filtro, agregarlo a la consulta
        if (separacion) {
            query.separacion = separacion;
        }

        // Buscar las recepciones de ganado aplicando el filtro (si existe)
        const recepciones = await Ganado.find(query).lean();

        // Formatear la fecha antes de pasarla a la vista
        recepciones.forEach(recepcion => {
            recepcion.arrivalDate = recepcion.arrivalDate.toLocaleDateString('es-ES');  // Formato: dd/mm/yyyy
            recepcion.isSeparacion = recepcion.separacion === 'Venta/Tercero';
        });

        // Renderizar la vista 'ganado/list', pasando las recepciones y el filtro seleccionado
        res.render('ganado/list', { recepciones, selectedSeparacion: separacion });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al obtener las recepciones de ganado");
    }
};




// Eliminar una recepción de ganado
export const deleteRecepcion = async (req, res) => {
    const { reemo } = req.params;
    
    try {
        // Eliminar la recepción de ganado por su ID
        await Ganado.findByIdAndDelete(reemo);
        res.redirect('/ganado/list');  // Redirigir a la lista después de eliminar
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar la recepción de ganado");
    }
};

// Controlador para mostrar el formulario de edición de una recepción
export const editarRecepcion = async (req, res) => {
    const { id } = req.params;  // Obtener el ID de la recepción

    try {
        // Buscar la recepción de ganado por ID
        const recepcion = await Ganado.findById(id).lean();
        const ganaderos = await Ganadero.find().lean();

        const esCria = recepcion.motivo === 'Cria';
        const esEngorda = recepcion.motivo === 'Engorda';
        const esSacrificio = recepcion.motivo === 'Sacrificio';

                // Ajustar la fecha a la zona horaria local
                const fechaUTC = new Date(recepcion.arrivalDate);
                fechaUTC.setMinutes(fechaUTC.getMinutes() - fechaUTC.getTimezoneOffset()); // Ajuste de la zona horaria
        
                // Formatear la fecha a yyyy-mm-dd
                const fechaFormateada = fechaUTC.toISOString().split('T')[0]; // 'yyyy-mm-dd'

        // Si no se encuentra la recepción, manejar el error
        if (!recepcion) {
            return res.status(404).send("Recepción de ganado no encontrada");
        }

        // Renderizar el formulario de edición pasando la recepción encontrada
        res.render('ganado/edit', { recepcion , ganaderos, esCria, esEngorda, esSacrificio, fechaFormateada});
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar la página de edición");
    }
};

// Función para actualizar la recepción de ganado
export const actualizarRecepcion = async (req, res) => {
    const { id } = req.params;
    const { reemo, motivo, arrivalDate, origin, destino } = req.body;

    try {
        // Buscar la recepción de ganado por ID
        const recepcion = await Ganado.findById(id);

        // Si no se encuentra la recepción, manejar el error
        if (!recepcion) {
            return res.status(404).send("Recepción de ganado no encontrada");
        }

        // Actualizar los datos de la recepción
        recepcion.reemo = reemo;
        recepcion.motivo = motivo;
        recepcion.arrivalDate = arrivalDate;
        recepcion.origin = origin;
        recepcion.destino = destino;

        // Guardar los cambios en la base de datos
        await recepcion.save();

        // Redirigir a la lista de recepciones o mostrar un mensaje de éxito
        res.redirect('/ganado/list');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al actualizar la recepción");
    }
};

// Renderizar todas las dietas
export const renderGanado = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el 'reemo' de la URL

        // Buscar la recepción de ganado por 'reemo'
        const recepcion = await Ganado.findById(id).lean();

        if (!recepcion) {
            return res.status(404).send("Recepción no encontrada");
        }

        // Obtener los animales de esa recepción (ya están dentro del campo 'ganado')
        const ganado = recepcion.ganado;

        // Renderizar la vista, pasando los animales y la recepción
        res.render("ganado/all-ganado", { ganado, recepcion });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al cargar los animales");
    }
};

// Controlador para cambiar el valor de separacion
export const cambiarSeparacion = async (req, res) => {
    const { id } = req.params; // Obtener el ID de la recepción de ganado desde la URL
  
    try {
      const ganado = await Ganado.findById(id); // Buscar el documento de Ganado por ID
  
      if (!ganado) {
        return res.status(404).send('Ganado no encontrado');
      }
  
      // Alternar entre 'venta/tercero' y 'propio/rancho'
      ganado.separacion = (ganado.separacion === 'Venta/Tercero') ? 'Propio/Rancho' : 'Venta/Tercero';
  
      // Guardar los cambios en la base de datos
      await ganado.save();
  
      // Redirigir a la página de detalles de la recepción de ganado
      res.redirect('/ganado/list');
    } catch (error) {
      console.log(error);
      res.status(500).send('Error al actualizar el campo separacion');
    }
  };
  


