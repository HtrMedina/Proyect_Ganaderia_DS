import Dieta from "../models/Dietas.js";

// Renderizar el formulario para crear una nueva dieta
export const renderDietaForm = (req, res) => {
  res.render("dietas/new-dieta"); // Vista para crear una nueva dieta
};

// Crear una nueva dieta
export const createNewDieta = async (req, res) => {
  const { nombre, ingredientes, cantidades } = req.body; // Extraemos los datos del formulario
  console.log('Ingredientes:', ingredientes);
  console.log('Cantidades:', cantidades);
  const errors = [];

  // Validación de campos
  if (!nombre) {
    errors.push({ text: "Escribe un nombre para la dieta." });
  }

  if (!ingredientes || ingredientes.some(ing => !ing.trim())) {
    errors.push({ text: "La dieta debe tener al menos un ingrediente." });
  }
  if (!cantidades || cantidades.some(cant => !cant)) {
    errors.push({ text: "Debe especificar la cantidad para cada ingrediente." });
  }  

  // Si hay errores, renderizamos el formulario con los errores y datos ingresados
  if (errors.length > 0) {
    return res.render("dietas/new-dieta", {
      errors,
      nombre,
      ingredientes,
    });
  }

  // Emparejamos los ingredientes con sus cantidades antes de guardar
  const ingredientesConCantidad = ingredientes.map((ingrediente, index) => ({
    ingrediente,
    cantidad: cantidades[index],  // Empareja cada ingrediente con su cantidad
  }));

  // Si no hay errores, creamos la nueva dieta
  const newDieta = new Dieta({
    nombre,
    ingredientes: ingredientesConCantidad,
  });

  // Asignamos la fecha de modificación
  newDieta.fechaModificacion = Date.now();

  // Guardamos la nueva dieta
  await newDieta.save();

  req.flash("success_msg", "Dieta Agregada Exitosamente");
  res.redirect("/dietas"); // Redirigimos a la lista de dietas
};


// Renderizar todas las dietas
export const renderDietas = async (req, res) => {
  const dietas = await Dieta.find() // Encontramos todas las dietas
    .sort({ fechaModificacion: "desc" }) // Ordenamos por fecha de modificación
    .lean();
  res.render("dietas/all-dietas", { dietas });
};

// Mostrar el formulario de edición para una dieta específica
export const renderEditForm = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Buscar la dieta por ID
    const dieta = await Dieta.findById(id).lean();
    
    // Verificar si la dieta existe
    if (!dieta) {
      req.flash("error_msg", "Dieta no encontrada");
      return res.redirect("/dietas");
    }

    // Renderizar la vista de edición con los datos de la dieta
    res.render("dietas/edit-dieta", { dieta });
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Hubo un error al cargar la dieta.");
    res.redirect("/dietas");
  }
};


// Actualizar la dieta en la base de datos
export const updateDieta = async (req, res) => {
  const { nombre, ingredientes, cantidades } = req.body; // Extraemos los datos del formulario
  const errors = [];

  // Validación de los datos del formulario
  if (!nombre) {
    errors.push({ text: "Escribe un nombre para la dieta." });
  }
  if (!ingredientes || ingredientes.length === 0) {
    errors.push({ text: "La dieta debe tener al menos un ingrediente." });
  }
  if (!cantidades || cantidades.length === 0) {
    errors.push({ text: "Debe especificar la cantidad para cada ingrediente." });
  }

  // Si hay errores, renderizar el formulario con los errores
  if (errors.length > 0) {
    return res.render("dietas/edit-dieta", {
      errors,
      nombre,
      ingredientes,
      cantidades,
      dieta: { _id: req.params.id, nombre, ingredientes, cantidades }
    });
  }

  // Emparejar los ingredientes con sus cantidades antes de actualizar
  const ingredientesConCantidad = ingredientes.map((ingrediente, index) => ({
    ingrediente,
    cantidad: cantidades[index],
  }));

  // Actualizar la dieta en la base de datos
  try {
    await Dieta.findByIdAndUpdate(req.params.id, {
      nombre,
      ingredientes: ingredientesConCantidad,
      fechaModificacion: Date.now(), // Actualizamos la fecha de modificación
    });
    req.flash("success_msg", "Dieta actualizada con éxito");
    res.redirect("/dietas"); // Redirigir a la lista de dietas
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Hubo un error al actualizar la dieta.");
    res.redirect("/dietas");
  }
};



export const deleteDieta = async (req, res) => {
  try {
    await Dieta.findByIdAndDelete(req.params.id); 
    req.flash("success_msg", "Dieta Eliminada Exitosamente");
    res.redirect("/dietas");
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Hubo un error al eliminar la dieta.");
    res.redirect("/dietas");
  }
};


