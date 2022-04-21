const express = require("express");
const app = express.Router();

app.use('/usuario',require('./usuario/usuario'))
app.use('/usuario2',require('./usuario/usuario2'))
app.use('/producto',require('./producto/producto'))


module.exports = app;