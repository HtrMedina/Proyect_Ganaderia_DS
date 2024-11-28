import Client from '../models/Clients.js';

export const renderClients = async (req, res) => {
    try {
        const clients = await Client.find().lean();
        res.render("clients/index", { clients });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar los clientes");
    }
};

export const createClient = async (req, res) => {
    try {
        const client = new Client(req.body);
        await client.save();
        res.redirect('/clients'); // Redirige a la lista de clientes después de guardar
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al guardar el cliente");
    }
};

export const renderClientEdit = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).lean();
        res.render("clients/edit", { client });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar el cliente");
    }
};

export const editClient = async (req, res) => {
    const { id } = req.params;
    try {
        await Client.findByIdAndUpdate(id, req.body, { new: true }); // { new: true } devuelve el documento actualizado
        res.redirect('/clients');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al editar el cliente");
    }
};

export const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        await Client.findByIdAndDelete(id);
        res.redirect('/clients');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar el cliente");
    }
};
