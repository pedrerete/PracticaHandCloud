const express = require("express");
const app = express.Router();

app.use('/usuario',require('./usuarios/usuario'))
app.use('/usuario2',require('./usuarios2/usuario2'))

module.exports = app;