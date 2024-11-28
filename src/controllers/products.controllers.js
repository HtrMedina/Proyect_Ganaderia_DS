import Product from '../models/Products.js';

export const renderProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render("products/index", { products });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar los productos");
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.redirect('/products'); // Redirige a la lista de productos después de guardar
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al guardar el producto");
    }
};

export const renderProductEdit = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        res.render("products/edit", { product });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar el producto");
    }
};

export const editProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await Product.findByIdAndUpdate(id, req.body, { new: true }); // { new: true } devuelve el documento actualizado
        res.redirect('/products');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al editar el producto");
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await Product.findByIdAndDelete(id);
        res.redirect('/products');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar el producto");
    }
};
