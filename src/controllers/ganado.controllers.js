import { Ganado } from '../models/Ganado.js';

// Crear recepción de ganado (Paso 1)
export const createRecepcionGanado = async (req, res) => {
    const { reemo, motivo, arrivalDate, origin, destino } = req.body;
    try {
        const recepcion = new Ganado({
            reemo,
            motivo,
            arrivalDate,
            origin,
            destino,
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
    const { earTag, sex, age, classification, weight, price, healthStatus } = req.body;

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
        // Buscar todas las recepciones de ganado
        const recepciones = await Ganado.find().lean();

                // Formatear la fecha antes de pasarla a la vista
                recepciones.forEach(recepcion => {
                    // Cambiar el formato de la fecha
                    recepcion.arrivalDate = recepcion.arrivalDate.toLocaleDateString('es-ES');  // Formato: dd/mm/yyyy
                });

        // Renderizar la vista 'ganado/list', pasando las recepciones
        res.render('ganado/list', { recepciones });
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
        res.render('ganado/edit', { recepcion , esCria, esEngorda, esSacrificio, fechaFormateada});
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