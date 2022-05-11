//Para usar mongoose
const mongoose = require("mongoose");

//Creamos el esquema de empresa
let Schemaempresa = mongoose.Schema({
    //si la empresa esta activa o no
    blnEstado:{
        type:Boolean,
        default:true
    },
    //nombre de la empresa
    strNombre:{
        type: String,
        required: [true,'No se recibio el strNombre, favor de ingresarlo'] 
    },
    //descripcion de la empresa
    strDescripcion:{
        type: String,
        required: [true,'No se recibio el strDescripcion, favor de ingresarlo'] 
    },
    //ciudad de la empresa
    strCiudad:{
        type: String,
        required: [true,'No se recibio el strCiudad, favor de ingresarlo'] 
    },
    //telefono de la empresa
    nmbTelefono:{
        type: Number,
        required: [true,'No se recibio el nmbTelefono, favor de ingresarlo'] 
    },
    //Codigo postal de la empresa
    nmbCodigoPostal:{
        type: Number,
        required: [true,'No se recibio el nmbCodigoPostal, favor de ingresarlo'] 
    },
    //imagen de la empresa
    strImagen:{
        type: String,
        default: 'default.jpg'
    },
    //email de la empresa, no se puede repetir
    strEmail:{
        type: String,
        required: [true,'No se recibio el strEmail, favor de ingresarlo'] 
    }
})
//exporetamos el eschema con el nombre de empresa
module.exports = mongoose.model('empresa',Schemaempresa);