//Para usar mongoose
const mongoose = require("mongoose");

//Creamos el esquema
let Schemaempresa = mongoose.Schema({
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
    strCiudad:{
        type: String,
        required: [true,'No se recibio el strCiudad, favor de ingresarlo'] 
    },
    nmbTelefono:{
        type: Number,
        required: [true,'No se recibio el nmbTelefono, favor de ingresarlo'] 
    },
    nmbCodigoPostal:{
        type: Number,
        required: [true,'No se recibio el nmbCodigoPostal, favor de ingresarlo'] 
    },
    strImagen:{
        type: String,
        default: 'default.jpg'
    },
    arrObjIdProductos:{
        type: mongoose.Types.ObjectId,
            required: [true,'No se recibio el arrObjIdProductos, favor de ingresarlo'] 
    },
    arrObjIdUsuarios:{
        type: mongoose.Types.ObjectId,
            required: [true,'No se recibio el arrObjIdUsuarios, favor de ingresarlo'] 
    }
})
//exporetamos el eschema con el nombre de producto
module.exports = mongoose.model('empresa',Schemaempresa);