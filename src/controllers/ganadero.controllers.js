import { Ganadero } from '../models/Ganadero.js';

// Mostrar todos los ganaderos
export const renderGanaderos = async (req, res) => {
    try {
        const ganaderos = await Ganadero.find().lean(); // Obtener todos los ganaderos
        res.render("ganaderos/index", { ganaderos });  // Renderizar la vista con los ganaderos
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar los ganaderos");
    }
};

// Crear un nuevo ganadero
export const createGanadero = async (req, res) => {
    try {
        const ganadero = new Ganadero(req.body); // Crear un nuevo ganadero con los datos del formulario
        await ganadero.save();  // Guardar el nuevo ganadero en la base de datos
        res.redirect('/ganaderos');  // Redirigir a la lista de ganaderos
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al guardar el ganadero");
    }
};

// Mostrar la página de edición de un ganadero
export const renderGanaderoEdit = async (req, res) => {
    try {
        const ganadero = await Ganadero.findById(req.params.id).lean(); // Obtener el ganadero por ID
        res.render("ganaderos/edit", { ganadero });  // Renderizar la vista de edición con los datos del ganadero
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar el ganadero");
    }
};

// Editar un ganadero
export const editGanadero = async (req, res) => {
    const { id } = req.params;
    try {
        await Ganadero.findByIdAndUpdate(id, req.body, { new: true }); // Actualizar el ganadero con los nuevos datos
        res.redirect('/ganaderos');  // Redirigir a la lista de ganaderos después de la actualización
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al editar el ganadero");
    }
};

// Eliminar un ganadero
export const deleteGanadero = async (req, res) => {
    const { id } = req.params;
    try {
        await Ganadero.findByIdAndDelete(id); // Eliminar el ganadero por ID
        res.redirect('/ganaderos');  // Redirigir a la lista de ganaderos
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar el ganadero");
    }
};
