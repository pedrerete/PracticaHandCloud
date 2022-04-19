//Express para el servidor
const { response } = require('express');
const express = require('express');
const app = express.Router();

//Inizializamos el arreglo de json de usuarios
let arrJsnUsuarios = [{ _id: 1, strNombre: 'Pedro', strApellido: 'Esparza', strEmail: 'pesparza@sigma-alimentos.com' }]

//Metodo GET para leer los datos
app.get('/', (req, res) => {
    const arrUsuarios = arrJsnUsuarios; //Tomo los usuarios
    //Regresamos el estatus
    return res.status(200).json({
        ok: true,
        msg: 'Se recibieron los usuarios de manera exitosa',
        cont: {
            arrUsuarios //El cont junto con el JSON muestra los valores dentro del arreglo
        }
    })
}) 
//Metodo Post para guardar un nuevo dato
app.post('/', (req, res) => {
    //Tomo los valores del body
    const _id = req.body._id
    const strNombre = req.body.strNombre
    const strApellido = req.body.strApellido
    const strEmail = req.body.strEmail
    hasMatch = false //Iniziliamos la variable que revisa si encuentra el ID
    if (_id && strNombre && strApellido && strEmail) { //Si algo no fue mandando, debe regresar un error
        //Barremos el arreglo buscando el match del ID
        for (var index = 0; index < arrJsnUsuarios.length; ++index) {
            var usuario = arrJsnUsuarios[index];
            if (usuario._id == _id) {
                hasMatch = true;//Si lo ecnuentra, activa la bandera 
                break;
            }
        }
        if (!hasMatch) { //Si no encontro un match
            //Creamos una variable con esos valores para el arreglo
            const body = { _id: +req.body._id, strNombre: req.body.strNombre, strApellido: req.body.strApellido, strEmail: req.body.strEmail }
            arrJsnUsuarios.push(body); //Lo insertamos en el arreglo
            //Regresamos el estatus
            res.status(200).json({
                ok: true,
                msg: 'Se recibio el usuario',
                cont: {
                    arrJsnUsuarios
                }
            })
        } else {//Se encontro un match
            //Regresamos el estatus
            return res.status(400).json({
                ok: false,
                msg: 'Se recibio un id repetido:'
            })
        }
    } else {
        return res.status(400).json({
            ok: false,
            msg: 'Se recibieron datos erroneos'
        })
    }
})
//Metodo Delete para borrar un dato
app.delete('/', (req, res) => {
    const _id = req.body._id //Tomamos el ID
    hasMatch = false//Inicilizamos variable del match
    if (_id) {//Si mando usuario
        //Barremos el arreglo en busca del match
        for (var index = 0; index < arrJsnUsuarios.length; ++index) {
            var usuario = arrJsnUsuarios[index];
            if (usuario._id == _id) {//Si lo encontramos
                hasMatch = true;//Cambiamos la bandera
                pos = index;//Guardamos la posicion del match
                break;
            }
        }
        if (hasMatch) {//Si fue encontrado
            arrJsnUsuarios.splice(pos, 1); //Borra un campo en la posicion "pos"
            //Regresa el estatus
            return res.status(400).json({
                ok: false,
                msg: 'Se elimino el usuario',
                cont: {
                    arrJsnUsuarios
                }
            })
        } else {//Si no encontro el usuario
            //Regresa el estatus
            return res.status(400).json({
                ok: false,
                msg: 'No se encontro el id'
            })
        }
    } else {//Si no se mando ID
        //Regresa el estatus
        return res.status(400).json({
            ok: false,
            msg: 'Se recibieron datos erroneos'
        })
    }
})
//Metodo PUT para actualizar un dato 
app.put('/', (req, res) => {
    //leemos los datos enviados
    const _id = req.body._id
    const strNombre = req.body.strNombre
    const strApellido = req.body.strApellido
    const strEmail = req.body.strEmail
    hasMatch = false //Inicializamos la variable del match
    if ((_id) && (strNombre || strApellido || strEmail)) { //Si se mando el ID y por lo menos uno de los otros datos
        //Barremos el arreglo en b usca del match
        for (var index = 0; index < arrJsnUsuarios.length; ++index) {
            var usuario = arrJsnUsuarios[index];
            if (usuario._id == _id) {//Si se encontro el match
                hasMatch = true;//Se cambia la banbera
                pos = index;//Se guarda la posicion del match
                break;
            }
        }
        if (hasMatch) {//Si se encontro el id
            if (strNombre) {//Si se mando nombre
                var usuario = arrJsnUsuarios[pos]; //Toma el valor del arreglo en la posicion POS
                usuario.strNombre = strNombre; //Actualiza el campo de nombre
                arrJsnUsuarios.splice(pos, 1, usuario); //Reemplaza el objeto en la posiicon "pos" con usuario
            }
            if (strApellido) {//Si se mando apellido
                var usuario = arrJsnUsuarios[pos];//Toma el valor del arreglo en la posicion POS
                usuario.strApellido = strApellido;//Actualiza el campo de apellido
                arrJsnUsuarios.splice(pos, 1, usuario);//Reemplaza el objeto en la posiicon "pos" con usuario
            }
            if (strEmail) {//Si se mando email
                var usuario = arrJsnUsuarios[pos];//Toma el valor del arreglo en la posicion POS
                usuario.strEmail = strEmail;//Actualiza el campo de email
                arrJsnUsuarios.splice(pos, 1, usuario);//Reemplaza el objeto en la posiicon "pos" con usuario
            }
            //Regresamos el estatus
            return res.status(200).json({
                ok: true,
                msg: 'Se actualizo el usuario',
                cont: {
                    arrJsnUsuarios
                }
            })
        } else {//Si no se encontro ID
            //Regresamos el estatus
            return res.status(400).json({
                ok: false,
                msg: 'No se encontro el ID'
            })
        }
    } else {//Si no se mando ID o no se mando algun campo a actualizar
        //Regresamos el estatus
        return res.status(400).json({
            ok: false,
            msg: 'Se recibieron datos erroneos'
        })
    }
})

//Para poder usar Express
module.exports = app;