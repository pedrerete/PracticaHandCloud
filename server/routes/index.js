/* Importación del módulo express y creación de un nuevo objeto de enrutador. */
const express = require("express");
const app = express.Router();

/* Importando las rutas desde los archivos en las carpetas. */
app.use('/usuario',require('./usuario/usuario'))
app.use('/producto',require('./producto/producto'))
app.use('/empresa',require('./empresa/empresa'))
app.use('/auth',require('./auth/login'))



/* Exportando el objeto `app`. */
module.exports = app;