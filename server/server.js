/* Importando los módulos que se necesitan para que el servidor funcione. */
require('./config/config');
require('colors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');

/* Un middleware que permite que el servidor reciba archivos en el cuerpo de la solicitud. */
app.use(fileUpload());
/* Un middleware que le permite enviar datos en el cuerpo de la solicitud. */
app.use(express.urlencoded({ extended: true }));
/* Un middleware que permite que el servidor reciba datos en el cuerpo de la solicitud. */
app.use(express.json())
/* Permitir que el servidor reciba solicitudes de otros dominios. */
app.use(cors());
/* Un middleware que permite que el servidor reciba solicitudes de otros dominios. */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    next();
});
/* Diciéndole al servidor que use las rutas en el archivo index.js en la carpeta de rutas. */
app.use('/api', require('./routes/index'))

/* Conexión a la base de datos. */
mongoose.connect("mongodb+srv://Pedro1622:uoZZc4LqnOIECmwB@cluster0.rhaba.mongodb.net/PedroEsparzaDB?retryWrites=true&w=majority", (err, resp) => {
    /* Comprobando si hay un error al conectarse a la base de datos. */
    if (err) {
        console.log("Error al conectar a la base de datos");
        console.log(err);
        return err;
    }
    console.log("Se conectó a la base de datos: ", ("mongodb+srv://Pedro1622:uoZZc4LqnOIECmwB@cluster0.rhaba.mongodb.net/PedroEsparzaDB?retryWrites=true&w=majority").blue);
})


/* Diciéndole al servidor que escuche el puerto que está en el archivo de configuración. */
app.listen(process.env.PORT, () => {
/* Imprimiendo un mensaje a la consola. */
    console.log('[NODE]'.green, 'esta corriendo en el puerto:'.red, (process.env.PORT).yellow);
})