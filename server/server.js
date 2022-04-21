require('./config/config');
require('colors');
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.urlencoded({ extended: true }))
//mandar al archivo de index para enrutar al usuario
app.use('/api', require('./routes/index'))

mongoose.connect(process.env.urlDB, (err, resp) => {
    if (err) {
        console.log("Error al conectar a la base de datos");
        console.log(err);
        return err;
    }
    console.log("Se conectó a la base de datos: ", (process.env.urlDB).blue);
})

app.listen(process.env.PORT, () => {
    console.log('[NODE]'.green, 'esta corriendo en el puerto:'.red, (process.env.PORT).yellow);
})
