import Tratamiento from '../models/Tratamiento.js';
import Almacen from '../models/Almacen.js'; 

// Mostrar todos los tratamientos
export const renderTratamientos = async (req, res) => {
    try {
        const tratamientos = await Tratamiento.find().lean(); // Obtener todos los tratamientos
        
        // Obtener todos los medicamentos del almacen
        const medicamentos = await Almacen.find({ category: 'Medicamento' }).lean();

        // Formatear la fecha de cada tratamiento antes de pasarla a la vista
        tratamientos.forEach(tratamiento => {
            const fecha = new Date(tratamiento.fechaColocacion); // Convertir la fecha a un objeto Date
            const fechaLocal = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000); // Ajustar la fecha a la zona horaria local
            
            const dia = ("0" + fechaLocal.getDate()).slice(-2);
            const mes = ("0" + (fechaLocal.getMonth() + 1)).slice(-2);
            const anio = fechaLocal.getFullYear();
            
            tratamiento.fechaFormateada = `${dia}/${mes}/${anio}`;
        });

        res.render("tratamientos/index", { tratamientos, medicamentos });  // Pasar los tratamientos y medicamentos a la vista
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar los tratamientos");
    }
};


// Crear un nuevo tratamiento
export const createTratamiento = async (req, res) => {
    try {
        // Desestructurar los datos del formulario
        const { numeroArete, tipoTratamiento, proposito, nombreMedicamento, fechaColocacion, quienColoco } = req.body;

        // Convertir la fecha de colocación en formato Date
        const fecha = new Date(fechaColocacion);

        // Crear el objeto tratamiento
        const tratamiento = new Tratamiento({
            numeroArete,
            tipoTratamiento,
            proposito,
            nombreMedicamento,
            fechaColocacion: fecha,
            quienColoco
        });

        // Guardar el tratamiento en la base de datos
        await tratamiento.save();

                // Buscar el medicamento en el modelo Almacen por su nombre
                const medicamento = await Almacen.findOne({ name: nombreMedicamento });  // Buscar por nombre

                if (medicamento) {
                    // Verificar si hay suficiente cantidad
                    if (medicamento.quantity > 0) {
                        // Restar una unidad del medicamento
                        await Almacen.findByIdAndUpdate(medicamento._id, { $inc: { quantity: -1 } });
                    } else {
                        // Si no hay suficiente stock, manejar el error
                        return res.status(400).send('No hay suficiente stock del medicamento seleccionado');
                    }
                } else {
                    // Si no se encuentra el medicamento
                    return res.status(404).send('Medicamento no encontrado en el inventario');
                }

        // Redirigir a la vista de tratamientos
        res.redirect('/tratamientos');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al guardar el tratamiento");
    }
};



// Mostrar la página de edición de un tratamiento
export const renderTratamientoEdit = async (req, res) => {
    const { id } = req.params;
    try {
        // Obtener el tratamiento por ID
        const tratamiento = await Tratamiento.findById(id).lean();
        
        // Obtener todos los medicamentos disponibles en el almacén
        const medicamentos = await Almacen.find({ category: 'Medicamento' }).lean();

        // Comparar el tipo de tratamiento y pasar un valor booleano a la vista
        const esPreventivo = tratamiento.tipoTratamiento === 'Preventivo';
        const esCurativo = tratamiento.tipoTratamiento === 'Curativo';

        // Ajustar la fecha a la zona horaria local
        const fechaUTC = new Date(tratamiento.fechaColocacion);
        fechaUTC.setMinutes(fechaUTC.getMinutes() - fechaUTC.getTimezoneOffset()); // Ajuste de la zona horaria

        // Formatear la fecha a yyyy-mm-dd
        const fechaFormateada = fechaUTC.toISOString().split('T')[0]; // 'yyyy-mm-dd'

        // Pasar los valores a la vista
        res.render("tratamientos/edit", { 
            tratamiento, 
            esPreventivo, 
            esCurativo,
            fechaFormateada,  // Pasar la fecha formateada
            medicamentos      // Pasar los medicamentos disponibles
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar el tratamiento");
    }
};


//Editar un tratamiento
export const editTratamiento = async (req, res) => {
    const { id } = req.params;
    const { numeroArete, tipoTratamiento, proposito, nombreMedicamento, fechaColocacion, quienColoco } = req.body;

    try {
        // La fecha viene en formato 'yyyy-mm-dd' desde el formulario
        const fecha = new Date(fechaColocacion);  // 'fechaColocacion' es de tipo 'yyyy-mm-dd'

        // Asegúrate de que la fecha no sea ajustada con la zona horaria
        // La fecha que llega ya debe estar correctamente formateada para almacenarse sin cambios

        const tratamiento = {
            numeroArete,
            tipoTratamiento,
            proposito,
            nombreMedicamento,
            fechaColocacion: fecha,  // Guardar la fecha directamente en la base de datos
            quienColoco
        };

        // Actualizar el tratamiento en la base de datos
        await Tratamiento.findByIdAndUpdate(id, tratamiento, { new: true });

        res.redirect('/tratamientos');  // Redirigir después de la actualización
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al editar el tratamiento");
    }
};



// Eliminar un tratamiento
export const deleteTratamiento = async (req, res) => {
    const { id } = req.params;
    try {
        await Tratamiento.findByIdAndDelete(id); // Eliminar el tratamiento
        res.redirect('/tratamientos');  // Redirigir al índice de tratamientos
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar el tratamiento");
    }
};
