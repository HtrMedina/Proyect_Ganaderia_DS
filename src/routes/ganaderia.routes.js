import { Router } from 'express';
import { renderAlmacenes, createAlmacen, renderAlmacenEdit, editAlmacen, deleteAlmacen, renderAddQuantityForm, addQuantity } from '../controllers/almacen.controllers.js';
import { isAuthenticated } from "../helpers/auth.js";

const router = Router();

router.get('/almacen', isAuthenticated, renderAlmacenes); // Ruta para mostrar los productos
router.post('/almacen/add', isAuthenticated, createAlmacen); // Ruta para crear un nuevo producto
router.get('/almacen/edit/:id', isAuthenticated, renderAlmacenEdit); // Ruta mostrar la edicion de producto
router.post('/almacen/edit/:id', isAuthenticated, editAlmacen); // Ruta para actualizar un producto
router.delete('/almacen/delete/:id', isAuthenticated, deleteAlmacen); // Ruta para eliminar un producto
// Importa las funciones del controlador
router.get('/almacen/addQuantity/:id', isAuthenticated, renderAddQuantityForm);  // Mostrar formulario
router.post('/almacen/addQuantity/:id', isAuthenticated, addQuantity);  // Procesar la adición de cantidad


import { renderGanaderos, createGanadero, renderGanaderoEdit, editGanadero, deleteGanadero } from '../controllers/ganadero.controllers.js';

router.get('/ganaderos', isAuthenticated, renderGanaderos); // Ruta para mostrar todos los ganaderos
router.post('/ganaderos/add', isAuthenticated, createGanadero); // Ruta para crear un nuevo ganadero
router.get('/ganaderos/edit/:id', isAuthenticated, renderGanaderoEdit); // Ruta para mostrar el formulario de edición de un ganadero
router.post('/ganaderos/edit/:id', isAuthenticated, editGanadero); // Ruta para editar un ganadero
router.get('/ganaderos/delete/:id', isAuthenticated, deleteGanadero); // Ruta para eliminar un ganadero

import { renderDietaForm, createNewDieta, renderDietas, renderEditForm, updateDieta, deleteDieta, } from '../controllers/dietas.controllers.js';

router.get('/dietas', isAuthenticated, renderDietas); // Mostrar todas las dietas
router.get('/dietas/new', isAuthenticated, renderDietaForm); // Mostrar formulario para crear una nueva dieta
router.post('/dietas', isAuthenticated, createNewDieta); // Crear una nueva dieta
router.get('/dietas/edit/:id', isAuthenticated, renderEditForm); // Mostrar formulario de edición
router.post('/dietas/edit/:id', isAuthenticated, updateDieta); // Actualizar una dieta
router.post('/dietas/delete/:id', isAuthenticated, deleteDieta); // Eliminar una dieta

import { renderTratamientos, createTratamiento, renderTratamientoEdit, editTratamiento, deleteTratamiento } from '../controllers/tratamiento.controllers.js';
  
router.get('/tratamientos', isAuthenticated, renderTratamientos); // Ruta para mostrar todos los tratamientos
router.post('/tratamientos', isAuthenticated, createTratamiento); // Ruta para crear un nuevo tratamiento
router.get('/tratamientos/edit/:id', isAuthenticated, renderTratamientoEdit); // Ruta para mostrar el formulario de edición de un tratamiento
router.post('/tratamientos/edit/:id', isAuthenticated, editTratamiento); // Ruta para actualizar un tratamiento (editado)
router.get('/tratamientos/delete/:id', isAuthenticated, deleteTratamiento); // Ruta para eliminar un tratamiento

import { FormularioRecepcion, createRecepcionGanado, addAnimales, saveRecepcion, showAddAnimalesForm, listRecepciones,deleteRecepcion,editarRecepcion,actualizarRecepcion, renderGanado } from '../controllers/ganado.controllers.js';

// Ruta para mostrar el formulario de recepción de ganado (Paso 1)
router.get('/ganado/add', isAuthenticated, FormularioRecepcion);
// Ruta para procesar los datos del formulario de recepción de ganado (Paso 1)
router.post('/ganado/add', isAuthenticated, createRecepcionGanado);  // Recibir los datos y guardar la recepción
// Ruta para mostrar el formulario de agregar animales (Paso 2)
router.get('/ganado/addAnimales/:reemo', isAuthenticated, showAddAnimalesForm);
// Ruta para agregar animales a la recepción de ganado (Paso 2)
router.post('/ganado/addAnimales/:reemo', isAuthenticated, addAnimales);  // Agregar el animal al array en el documento de la recepción
// Ruta para finalizar la recepción y guardar todo
router.post('/ganado/saveRecepcion/:reemo', isAuthenticated, saveRecepcion);  // Guardar todo cuando ya se han agregado los animales
// Ruta para listar todas las recepciones de ganado
router.get('/ganado/list', isAuthenticated, listRecepciones);
// Ruta para eliminar una recepción de ganado
router.post('/ganado/delete/:reemo', isAuthenticated, deleteRecepcion);
// Ruta para actualizar una recepción de ganado
router.get('/ganado/edit/:id', isAuthenticated, editarRecepcion);
router.post('/ganado/edit/:id', isAuthenticated, actualizarRecepcion);
// Ruta para mostrar los animales de una recepción de ganado
router.get("/ganado/listGanado/:id", isAuthenticated, renderGanado);


import { renderVentas, createVenta, renderVenta, downloadVentaPDF } from '../controllers/ventas.controllers.js';

// Ruta para ver todas las ventas
router.get('/ventas', isAuthenticated, renderVentas);
// Ruta para crear una nueva venta
router.get('/ventas/add', (req, res) => res.render('ventas/add-venta')); // Formulario para agregar una nueva venta
router.post('/ventas/add', isAuthenticated, createVenta);
// Ruta para ver detalles de una venta específica
router.get('/ventas/:id', isAuthenticated, renderVenta);
// Ruta para descargar el PDF de la venta
router.get('/ventas/:id/pdf', isAuthenticated, downloadVentaPDF);



export default router;
