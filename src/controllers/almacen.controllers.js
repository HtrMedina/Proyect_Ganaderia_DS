import Almacen from '../models/Almacen.js';  // Importamos el modelo de Almacen

// 1. Renderizar los productos en el inventario
export const renderAlmacenes = async (req, res) => {
    try {
        // Buscamos todos los productos (almacenes) y los convertimos en un array plano
        const almacenes = await Almacen.find().lean();
        // Formatear la fecha
        almacenes.forEach(item => {
            // Formatear fecha en formato dd-mm-yyyy
            const date = new Date(item.ingresoDate);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
            const year = date.getFullYear();
            item.formattedIngresoDate = `${day}/${month}/${year}`;
        });
        // Renderizamos la vista y pasamos los almacenes encontrados
        res.render("almacen/index", { almacenes });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar el inventario");
    }
};

// 2. Crear un nuevo producto (almacén)
export const createAlmacen = async (req, res) => {
    try {
        // Desestructuramos los datos que vienen del cuerpo de la solicitud
        const { name, quantity, unit, priceUnit, category } = req.body;

        // Calculamos la inversión antes de crear el nuevo producto
        const investment = quantity * priceUnit;

        // Creamos un nuevo objeto de Almacen con los datos recibidos, incluyendo la inversión calculada
        const almacen = new Almacen({
            name,
            quantity,
            unit,
            priceUnit,
            investment,  // Asignamos la inversión calculada
            category
        });

        // Guardamos el producto en la base de datos
        await almacen.save();

        // Redirigimos a la lista de productos después de guardar
        res.redirect('/almacen');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al guardar el producto");
    }
};

// 3. Renderizar la vista de edición del producto
export const renderAlmacenEdit = async (req, res) => {
    try {
        // Buscamos el producto por su id para editarlo
        const almacen = await Almacen.findById(req.params.id).lean();
        // Renderizamos la vista de edición y pasamos los datos del producto
        res.render('almacen/edit', { 
            almacen,
            selectedUnit: almacen.unit, // Pasar la unidad seleccionada al template
            selectedCategory: almacen.category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar el producto");
    }
};

// 4. Editar un producto en el inventario
export const editAlmacen = async (req, res) => {
    const { id } = req.params; // Extraemos el id del producto desde los parámetros de la URL
    try {
        // Buscamos el producto por su id y lo actualizamos con los nuevos datos
        await Almacen.findByIdAndUpdate(id, req.body, { new: true }); // { new: true } devuelve el documento actualizado
        // Redirigimos a la lista de productos después de editar
        res.redirect('/almacen');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al editar el producto");
    }
};

// 5. Eliminar un producto del inventario
export const deleteAlmacen = async (req, res) => {
    const { id } = req.params; // Extraemos el id del producto desde los parámetros de la URL
    try {
        // Buscamos el producto por su id y lo eliminamos
        await Almacen.findByIdAndDelete(id);
        // Redirigimos a la lista de productos después de eliminar
        res.redirect('/almacen');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar el producto");
    }
};

// Mostrar el formulario para agregar cantidad
export const renderAddQuantityForm = async (req, res) => {
    try {
        const { id } = req.params;
        // Buscar el producto en la base de datos por id
        const almacen = await Almacen.findById(id).lean();
        // Renderizar el formulario y pasar la información del producto
        res.render('almacen/addQuantity', { almacen });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar el producto para agregar cantidad");
    }
};

// Procesar la adición de cantidad
export const addQuantity = async (req, res) => {
    const { id } = req.params;
    const { extraQuantity, newPriceUnit } = req.body;  // Recibir la cantidad extra y el nuevo precio unitario

    try {
        // Buscar el producto por su ID
        const almacen = await Almacen.findById(id);

        // Si el producto no existe, devolver error
        if (!almacen) {
            return res.status(404).send("Producto no encontrado");
        }

        // Actualizar la cantidad, precio y la inversión
        almacen.quantity += parseInt(extraQuantity);  // Sumar la cantidad
        almacen.priceUnit = newPriceUnit ? parseFloat(newPriceUnit) : almacen.priceUnit;  // Actualizar precio unitario si se proporcionó
        almacen.investment += parseFloat(extraQuantity) * almacen.priceUnit;  // Sumar a la inversión

        // Guardar el producto actualizado en la base de datos
        await almacen.save();

        // Redirigir al inventario
        res.redirect('/almacen');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al agregar la cantidad");
    }
};

