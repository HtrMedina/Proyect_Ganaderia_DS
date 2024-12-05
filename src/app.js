// Importación de librerías de terceros
import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import methodOverride from "method-override";
import flash from "connect-flash";
import passport from "passport";
import morgan from "morgan";
import MongoStore from "connect-mongo";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from 'body-parser';

// Archivos de configuración
import { MONGODB_URI, PORT } from "./config.js";

// Rutas de la aplicación
import indexRoutes from "./routes/index.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import userRoutes from "./routes/auth.routes.js";
import ganadoRoutes from "./routes/ganaderia.routes.js";

// Archivos de configuración adicionales
import "./config/passport.js";

// Inicializaciones
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuración de la app
app.set("port", PORT);
app.set("views", join(__dirname, "views"));

// Configuración del motor de plantillas
const hbs = exphbs.create({
  defaultLayout: "main",
  layoutsDir: join(app.get("views"), "layouts"),
  partialsDir: join(app.get("views"), "partials"),
  extname: ".hbs",
  helpers: {
    eq: function(a, b) {
      return a === b;
    },
  },
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Middleware de la app
app.use(bodyParser.urlencoded({ extended: true })); // Para procesar datos de formularios (urlencoded)
app.use(bodyParser.json()); // Para procesar datos JSON

// Middlewares adicionales
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Variables globales
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Rutas
app.use(indexRoutes);
app.use(userRoutes);
app.use(notesRoutes);
app.use(ganadoRoutes);

// Archivos estáticos
app.use(express.static(join(__dirname, "public")));

// Página no encontrada (404)
app.use((req, res, next) => {
  return res.status(404).render("404");
});

// Manejo de errores
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("error", {
    error,
  });
});

// Exportación de la app
export default app;
