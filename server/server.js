/* Importación de los módulos necesarios para que se ejecute la aplicación. */
/* Importando el archivo de configuración. */
require('./config/config');
/* Un módulo que te permite usar colores en la consola. */
require('colors');
/* Importación del módulo express. */
const express = require("express");
/* Importación del módulo mongoose. */
const mongoose = require("mongoose");
/* Creación de una instancia de la aplicación express. */
const app = express();

/* Un middleware que analiza el cuerpo de la solicitud. */
app.use(express.urlencoded({ extended: true }))

/* Diciéndole al servidor que use las rutas en el archivo index.js en la carpeta de rutas. */
app.use('/api', require('./routes/index'))

/* Conexión a la base de datos. */
mongoose.connect(process.env.urlDB, (err, resp) => {
    /* Comprobando si hay un error al conectarse a la base de datos. */
    if (err) {
        console.log("Error al conectar a la base de datos");
        console.log(err);
        return err;
    }
    console.log("Se conectó a la base de datos: ", (process.env.urlDB).blue);
})


/* Diciéndole al servidor que escuche el puerto que está en el archivo de configuración. */
app.listen(process.env.PORT, () => {
/* Imprimiendo un mensaje a la consola. */
    console.log('[NODE]'.green, 'esta corriendo en el puerto:'.red, (process.env.PORT).yellow);
})