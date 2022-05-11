//Para usar mongoose
const mongoose = require("mongoose");

//Creamos el esquema usuario
let SchemaUsuario = mongoose.Schema({
    //Si el usuario esta activo o no
    blnEstado:{
        type:Boolean,
        default:true
    },
    //nombre del usuario
    strNombre:{
        type: String,
        required: [true,'No se recibio el strNombre, favor de ingresarlo'] 
    },
    //nombre de usuario del usuario, no se puede repetir
    strNombreUsuario:{
        type: String,
        required: [true,'No se recibio el strNombreUsuario, favor de ingresarlo'] 
    },
    //apellido del usuario
    strApellido:{
        type: String,
        required: [true,'No se recibio el strApellido, favor de ingresarlo'] 
    },
    //direccion del usuario
    strDireccion:{
        type: String,
        required: [true,'No se recibio el strDireccion, favor de ingresarlo'] 
    },
    //email del usuario, no se puede repetir
    strEmail:{
        type: String,
        required: [true,'No se recibio el strEmail, favor de ingresarlo'] 
    },
    //conrasena del usuario, se guarda con hash
    strContrasena:{
        type: String,
        required: [true,'No se recibio el strContraseña, favor de ingresarlo'] 
    },
    //id de la empresa a la que pertenece el usuario
    idEmpresa:{
        type: mongoose.Types.ObjectId,
        required: [true,'No se recibio el idEmpresa, favor de ingresarlo'] 
    },
    //imagen del usuario
    strImagen:{
        type: String,
        default: 'default.jpg'
        },
    //id del rol que tiene el usuario
    _idObjRol:{
            type: mongoose.Types.ObjectId,
            required: [false,'No se recibio el idObjRol, favor de ingresarlo'] 
    }
})
//exporetamos el eschema con el nombre de usuario
module.exports = mongoose.model('usuario',SchemaUsuario);
