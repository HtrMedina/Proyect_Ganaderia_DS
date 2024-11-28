import { Router } from "express";
import { renderIndex, renderAbout } from "../controllers/index.controllers.js";
import {renderProducts, createProduct, renderProductEdit, editProduct, deleteProduct} from '../controllers/products.controllers.js';
import {renderClients, createClient, renderClientEdit, editClient, deleteClient} from '../controllers/clients.controllers.js';
import {renderSuppliers, createSupplier, renderSupplierEdit, editSupplier, deleteSupplier} from '../controllers/proveedor.controllers.js';
import { isAuthenticated } from "../helpers/auth.js";

const router = Router();

router.get("/", renderIndex);
router.get("/about", renderAbout);

// Rutas de productos
router.get("/products", isAuthenticated, renderProducts); // Mostrar todos los productos
router.post("/products/add", isAuthenticated, createProduct); // Añadir un producto
router.get("/products/edit/:id", isAuthenticated, renderProductEdit); // Mostrar formulario de edición de producto
router.post("/products/edit/:id", isAuthenticated, editProduct); // Actualizar producto
router.delete("/products/delete/:id", isAuthenticated, deleteProduct); // Eliminar producto

// Rutas de clientes
router.get("/clients", isAuthenticated, renderClients); // Mostrar todos los clientes
router.post("/clients/add", isAuthenticated, createClient); // Añadir un cliente
router.get("/clients/edit/:id", isAuthenticated, renderClientEdit); // Mostrar formulario de edición de cliente
router.post("/clients/edit/:id", isAuthenticated, editClient); // Actualizar cliente
router.delete("/clients/delete/:id", isAuthenticated, deleteClient); // Eliminar cliente

// Rutas de proveedores
router.get("/suppliers", isAuthenticated, renderSuppliers); // Mostrar todos los proveedores
router.post("/suppliers/add", isAuthenticated, createSupplier); // Añadir un proveedor
router.get("/suppliers/edit/:id", isAuthenticated, renderSupplierEdit); // Mostrar formulario de edición de proveedor
router.post("/suppliers/edit/:id", isAuthenticated, editSupplier); // Actualizar proveedor
router.delete("/suppliers/delete/:id", isAuthenticated, deleteSupplier); // Eliminar proveedor

export default router;
