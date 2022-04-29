//Para usar mongoose
const mongoose = require("mongoose");

//Creamos el esquema
let SchemaApi = mongoose.Schema({
    //nombre, tipo, si es requerido o no y el mensaje si es requerido y no se manda
    blnEstado:{
        type:Boolean,
        default:true
    },
    strRuta:{
        type: String,
        required: [true,'No se recibio el strRuta, favor de ingresarlo'] 
    },
    //nombre, tipo, si es requerido o no y el mensaje si es requerido y no se manda
    strMetodo:{
        type: String,
        required: [true,'No se recibio el strMetodo, favor de ingresarlo'] 
    },
    //nombre, tipo, si es requerido o no y el mensaje si es requerido y no se manda
    strDescripcion:{
        type: String,
        required: [true,'No se recibio el strDescripcion, favor de ingresarlo'] 
    },
    blnEsApi:{
        type:Boolean,
        default:true
    },
    blnEsMenu:{
        type:Boolean,
        default:false
    },
    blnRolDefault:{
        type:Boolean,
        default:false
    },
})
//exporetamos el eschema con el nombre de producto
module.exports = mongoose.model('api',SchemaApi);
