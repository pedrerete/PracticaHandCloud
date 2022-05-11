//Para usar mongoose
const mongoose = require("mongoose");

//Creacion el esquema de producto
let SchemaProducto = mongoose.Schema({
    //si el producto esta activo o mo
    blnEstado:{
        type:Boolean,
        default:true
    },
    //nombre del producto
    strNombre:{
        type: String,
        required: [true,'No se recibio el strNombre, favor de ingresarlo'] 
    },
    //descripcion del producto
    strDescripcion:{
        type: String,
        required: [true,'No se recibio el strDescripcion, favor de ingresarlo'] 
    },
    //cantidad de productos en el inventario
    nmbCantidad:{
        type: Number,
        required: [true,'No se recibio el nmbCantidad, favor de ingresarlo'] 
    },
    //precio del producto
    nmbPrecio:{
        type: Number,
        required: [true,'No se recibio el nmbPrecio, favor de ingresarlo'] 
    },
    //imagen del producto
    strImagen:{
        type: String,
        default: 'default.jpg'
    },
    //id de la empresa a la que pertenece el producto
    idEmpresa:{
        type: mongoose.Types.ObjectId,
        required: [true,'No se recibio el idEmpresa, favor de ingresarlo'] 
    },
    //SKU o identificador del producto
    nmbSku:{
        type: Number,
        required: [true,'No se recibio el nmbSku, favor de ingresarlo'] 
    }
})
//exporetamos el eschema con el nombre de producto
module.exports = mongoose.model('producto',SchemaProducto);
