//Para usar mongoose
const mongoose = require("mongoose");

//Creamos el esquema de rol
let SchemaRol = mongoose.Schema({
    //si el rol esta activo o no
    blnEstado:{
        type:Boolean,
        default:true
    },
    //nombre del rol
    strNombre:{
        type: String,
        required: [true,'No se recibio el strNombre, favor de ingresarlo'] 
    },
    //descripcion del rol
    strDescripcion:{
        type: String,
        required: [true,'No se recibio el strDescripcion, favor de ingresarlo'] 
    },
    //arreglo de apis que tiene el rol
    arrObjIdApis: [mongoose.Types.ObjectId],
    //si el rol es el rol default o no
    blnRolDefault:{
        type:Boolean,
        default:false
    }
})
//exporetamos el eschema con el nombre de rol
module.exports = mongoose.model('rol',SchemaRol);
