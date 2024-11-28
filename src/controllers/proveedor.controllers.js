import Supplier from '../models/Proveedor.js';

export const renderSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().lean();
        res.render("suppliers/index", { suppliers });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar los proveedores");
    }
};

export const createSupplier = async (req, res) => {
    try {
        const supplier = new Supplier(req.body);
        await supplier.save();
        res.redirect('/suppliers'); // Redirige a la lista de proveedores después de guardar
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al guardar el proveedor");
    }
};

export const renderSupplierEdit = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id).lean();
        res.render("suppliers/edit", { supplier });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar el proveedor");
    }
};

export const editSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        await Supplier.findByIdAndUpdate(id, req.body, { new: true }); // { new: true } devuelve el documento actualizado
        res.redirect('/suppliers');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al editar el proveedor");
    }
};

export const deleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        await Supplier.findByIdAndDelete(id);
        res.redirect('/suppliers');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar el proveedor");
    }
};
