//Express para el servidor
const { response } = require('express');
const express = require('express');
const app = express.Router();


//Inizializamos el arreglo de json de productos
let arrJsnProductos = [{ _id: 1, strNombre: '', strDescripcion: '', nmbCantidad: 0, nmbPrecio: 0 }]

//Metodo GET para leer los datos de producto
app.get('/', (req, res) => {
    const arrProductos = arrJsnProductos; //Tomo los productos
    //Regresamos el estatus
    if (arrProductos.length == 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay datos en el arreglo de productos',
        })
    }
    return res.status(200).json({
        ok: true,
        msg: 'Se regresaron los productos de manera exitosa',
        cont: {
            arrProductos //El cont junto con el JSON muestra los valores dentro del arreglo
        }
    })
})
//Metodo Post para guardar un nuevo dato
app.post('/', (req, res) => {
    //Tomo los valores del body
    const _id = req.body._id
    const strNombre = req.body.strNombre
    const strDescripcion = req.body.strDescripcion
    const nmbCantidad = req.body.nmbCantidad
    const nmbPrecio = req.body.nmbPrecio

    hasMatch = false //Iniziliamos la variable que revisa si encuentra el ID
    if (_id && strNombre && strDescripcion && nmbCantidad && nmbPrecio) { //Si algo no fue mandando, debe regresar un error
        //Barremos el arreglo buscando el match del ID
        for (var index = 0; index < arrJsnProductos.length; ++index) {
            var producto = arrJsnProductos[index];
            if (producto._id == _id) {
                //Regresamos el estatus
                return res.status(400).json({
                    ok: false,
                    msg: 'Se recibio un id repetido'
                })
            }
        }
       
        //Creamos una variable con esos valores para el arreglo
        const body = { _id: +req.body._id, strNombre: req.body.strNombre, strDescripcion: req.body.strDescripcion, nmbCantidad: req.body.nmbCantidad, nmbPrecio: req.body.nmbPrecio }
        arrJsnProductos.push(body); //Lo insertamos en el arreglo
        //Regresamos el estatus
        return res.status(200).json({
            ok: true,
            msg: 'Se recibio el producto',
            cont: {
                arrJsnProductos
            }
        })
    }
    //regresamos el estatus
    return res.status(400).json({
        ok: false,
        msg: 'Se recibieron datos erroneos'
    })

})
//Metodo Delete para borrar un dato
app.delete('/', (req, res) => {
    const _id = req.body._id //Tomamos el ID
    hasMatch = false//Inicilizamos variable del match
    if (_id) {//Si mando producto
        //Barremos el arreglo en busca del match
        for (var index = 0; index < arrJsnProductos.length; ++index) {
            var producto = arrJsnProductos[index];
            if (producto._id == _id) {//Si lo encontramos
                hasMatch = true;//Cambiamos la bandera
                pos = index;//Guardamos la posicion del match
                break;
            }
        }
        if (hasMatch) {//Si fue encontrado
            const producto = arrJsnProductos[pos]; //extraemos el producto eliminado para mostrarlo
            arrJsnProductos.splice(pos, 1); //Borra un campo en la posicion "pos"
            //Regresa el estatus
            return res.status(200).json({
                ok: true,
                msg: 'Se elimino el producto',
                cont: {
                    producto
                }
            })
        }
        //Si no encontro el producto
        //Regresa el estatus
        return res.status(400).json({
            ok: false,
            msg: 'No se encontro el id'
        })

    } //Si no se mando ID
    //Regresa el estatus
    return res.status(400).json({
        ok: false,
        msg: 'Se recibieron datos erroneos'
    })

})
//Metodo PUT para actualizar un dato 
app.put('/', (req, res) => {
    //leemos los datos enviados
    const _id = req.body._id
    const strNombre = req.body.strNombre
    const strDescripcion = req.body.strDescripcion
    const nmbCantidad = req.body.nmbCantidad
    const nmbPrecio = req.body.nmbPrecio
    hasMatch = false //Inicializamos la variable del match
    if ((_id) && (strNombre || strDescripcion || nmbCantidad || nmbPrecio)) { //Si se mando el ID y por lo menos uno de los otros datos
        //Barremos el arreglo en b usca del match
        for (var index = 0; index < arrJsnProductos.length; ++index) {
            var producto = arrJsnProductos[index];
            if (producto._id == _id) {//Si se encontro el match
                hasMatch = true;//Se cambia la banbera
                pos = index;//Se guarda la posicion del match
                break;
            }
        }
        if (hasMatch) {//Si se encontro el id
            if (strNombre) {//Si se mando nombre
                var producto = arrJsnProductos[pos]; //Toma el valor del arreglo en la posicion POS
                producto.strNombre = strNombre; //Actualiza el campo de nombre
                arrJsnProductos.splice(pos, 1, producto); //Reemplaza el objeto en la posiicon "pos" con producto
            }
            if (strDescripcion) {//Si se mando descripcion
                var producto = arrJsnProductos[pos];//Toma el valor del arreglo en la posicion POS
                producto.strDescripcion = strDescripcion;//Actualiza el campo de descripcion
                arrJsnProductos.splice(pos, 1, producto);//Reemplaza el objeto en la posiicon "pos" con producto
            }
            if (nmbCantidad) {//Si se mando cantidad
                var producto = arrJsnProductos[pos];//Toma el valor del arreglo en la posicion POS
                producto.nmbCantidad = nmbCantidad;//Actualiza el campo de cantidad
                arrJsnProductos.splice(pos, 1, producto);//Reemplaza el objeto en la posiicon "pos" con producto
            }
            if (nmbPrecio) {//Si se mando precio
                var producto = arrJsnProductos[pos];//Toma el valor del arreglo en la posicion POS
                producto.nmbPrecio = nmbPrecio;//Actualiza el campo de precio
                arrJsnProductos.splice(pos, 1, producto);//Reemplaza el objeto en la posiicon "pos" con producto
            }
            //Regresamos el estatus
            return res.status(200).json({
                ok: true,
                msg: 'Se actualizo el producto',
                cont: {
                    arrJsnProductos
                }
            })
        }
        //Si no se encontro ID
        //Regresamos el estatus
        return res.status(400).json({
            ok: false,
            msg: 'No se encontro el ID'
        })

    }
    //Si no se mando ID o no se mando algun campo a actualizar
    //Regresamos el estatus
    return res.status(400).json({
        ok: false,
        msg: 'Se recibieron datos erroneos'
    })

})

//Para poder usar Express
module.exports = app;