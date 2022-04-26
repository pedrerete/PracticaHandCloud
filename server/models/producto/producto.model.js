//Para usar mongoose
const mongoose = require("mongoose");

//Creamos el esquema
let SchemaProducto = mongoose.Schema({
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
    strDescripcion:{
        type: String,
        required: [true,'No se recibio el strDescripcion, favor de ingresarlo'] 
    },
    //nombre, tipo, si es requerido o no y el mensaje si es requerido y no se manda
    nmbCantidad:{
        type: Number,
        required: [true,'No se recibio el nmbCantidad, favor de ingresarlo'] 
    },
    //nombre, tipo, si es requerido o no y el mensaje si es requerido y no se manda
    nmbPrecio:{
        type: Number,
        required: [true,'No se recibio el nmbPrecio, favor de ingresarlo'] 
    }
})
//exporetamos el eschema con el nombre de producto
module.exports = mongoose.model('producto',SchemaProducto);
