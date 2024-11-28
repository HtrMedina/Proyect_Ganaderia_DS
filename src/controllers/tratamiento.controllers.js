import Tratamiento from '../models/Tratamiento.js';

// Mostrar todos los tratamientos
// Mostrar todos los tratamientos
export const renderTratamientos = async (req, res) => {
    try {
        const tratamientos = await Tratamiento.find().lean();  // Obtener todos los tratamientos
        
        // Formatear la fecha de cada tratamiento antes de pasarla a la vista
        tratamientos.forEach(tratamiento => {
            const fecha = new Date(tratamiento.fechaColocacion); // Convertir la fecha a un objeto Date
            
            // Ajustar la fecha a la zona horaria local
            const fechaLocal = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
            
            // Formatear la fecha a dd/mm/yyyy
            const dia = ("0" + fechaLocal.getDate()).slice(-2);
            const mes = ("0" + (fechaLocal.getMonth() + 1)).slice(-2); // Mes (debe sumarse 1 ya que enero es 0)
            const anio = fechaLocal.getFullYear(); // Obtener el año
            
            tratamiento.fechaFormateada = `${dia}/${mes}/${anio}`; // Formatear la fecha
        });

        res.render("tratamientos/index", { tratamientos });  // Pasar los tratamientos formateados a la vista
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar los tratamientos");
    }
};


// Crear un nuevo tratamiento
// Crear un nuevo tratamiento
export const createTratamiento = async (req, res) => {
    try {
        const { numeroArete, tipoTratamiento, proposito, nombreMedicamento, fechaColocacion, quienColoco } = req.body;

        // La fecha ya debería estar en el formato 'yyyy-mm-dd', sin embargo, la convertimos explícitamente a un objeto Date
        const fecha = new Date(fechaColocacion);  // 'fechaColocacion' debe estar en formato 'yyyy-mm-dd'

        // Crear el objeto tratamiento
        const tratamiento = new Tratamiento({
            numeroArete,
            tipoTratamiento,
            proposito,
            nombreMedicamento,
            fechaColocacion: fecha,  // Almacenar la fecha en UTC (la fecha ya está ajustada al formato correcto)
            quienColoco
        });

        // Guardar el tratamiento en la base de datos
        await tratamiento.save();  // Guardar el tratamiento
        res.redirect('/tratamientos');  // Redirigir al índice de tratamientos
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al guardar el tratamiento");
    }
};


// Mostrar la página de edición de un tratamiento
export const renderTratamientoEdit = async (req, res) => {
    const { id } = req.params;
    try {
        const tratamiento = await Tratamiento.findById(id).lean(); // Obtener el tratamiento por ID
        
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
            fechaFormateada  // Pasar la fecha formateada
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar el tratamiento");
    }
};

//Editar un tratamiento
// Editar un tratamiento
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
