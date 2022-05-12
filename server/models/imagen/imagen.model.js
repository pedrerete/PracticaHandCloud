//Para usar mongoose
const mongoose = require("mongoose");

//Creamos el esquema
let SchemaImagen = mongoose.Schema({
    //nombre, tipo, si es requerido o no y el mensaje si es requerido y no se manda
    blnEstado:{
        type:Boolean,
        default:true
    },
    strNombre:{
        type: String,
        required: [true,'No se recibio el strNombre, favor de ingresarlo'] 
    },
    //nombre, tipo, si es requerido o no y el mensaje si es requerido y no se manda
    _uniqueID:{
        type: String
    },
    //nombre, tipo, si es requerido o no y el mensaje si es requerido y no se manda
    strImagen:{
        type: String
    }
})

//exporetamos el eschema con el nombre de producto
module.exports = mongoose.model('imagen',SchemaImagen);
