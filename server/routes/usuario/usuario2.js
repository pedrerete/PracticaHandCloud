/* Importación del módulo express y creación de un nuevo objeto de enrutador. */
const express = require('express');
const app = express.Router();

/* Una función que se está exportando al archivo principal. */
app.get('/',(req,res)=>{
    return res.status(200).json({
        ok:true,
        msg:'Se recibio la ruta usuario2 en el metodo get'
    })
})

/* Exportar el objeto `app` para que pueda usarse en otros archivos. */
module.exports = app;