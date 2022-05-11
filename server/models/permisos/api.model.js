//Para usar mongoose
const mongoose = require("mongoose");

//Creamos el esquema de api
let SchemaApi = mongoose.Schema({
    //si la api esta activa o no
    blnEstado:{
        type:Boolean,
        default:true
    },
    //ruta a la que apunta la api
    strRuta:{
        type: String,
        required: [true,'No se recibio el strRuta, favor de ingresarlo'] 
    },
    //metodo http de la api
    strMetodo:{
        type: String,
        required: [true,'No se recibio el strMetodo, favor de ingresarlo'] 
    },
    //descripcion de la api
    strDescripcion:{
        type: String,
        required: [true,'No se recibio el strDescripcion, favor de ingresarlo'] 
    },
    //si es api o no
    blnEsApi:{
        type:Boolean,
        default:true
    },
    //si es menu o no
    blnEsMenu:{
        type:Boolean,
        default:false
    },
    //si va en el rol default o no
    blnRolDefault:{
        type:Boolean,
        default:false
    },
})
//exporetamos el eschema con el nombre de api
module.exports = mongoose.model('api',SchemaApi);
