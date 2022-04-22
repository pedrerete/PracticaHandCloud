//Para usar mongoose
const mongoose = require("mongoose");

//Creamos el esquema
let SchemaUsuario = mongoose.Schema({
    //nombre, tipo, si es requerido o no y el mensaje si es requerido y no se manda
    strNombre:{
        type: String,
        required: [true,'No se recibio el strNombre, favor de ingresarlo'] 
    },
    //nombre, tipo, si es requerido o no y el mensaje si es requerido y no se manda
    strApellido:{
        type: String,
        required: [true,'No se recibio el strApellido, favor de ingresarlo'] 
    },
    //nombre, tipo, si es requerido o no y el mensaje si es requerido y no se manda
    strDireccion:{
        type: String,
        required: [true,'No se recibio el strDireccion, favor de ingresarlo'] 
    },
    strEmail:{
        type: String,
        required: [true,'No se recibio el strEmail, favor de ingresarlo'] 
    },strContrasena:{
        type: String,
        required: [true,'No se recibio el strContraseña, favor de ingresarlo'] 
    },
})
//exporetamos el eschema con el nombre de usuario
module.exports = mongoose.model('usuario',SchemaUsuario);
