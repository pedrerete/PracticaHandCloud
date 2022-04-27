//Express para el servidor
const { response } = require('express');
const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt')
//Inizializamos el arreglo de json de usuarios
let arrJsnUsuarios = [{ _id: 1, strNombre: 'Pedro', strApellido: 'Esparza', strEmail: 'pesparza@sigma-alimentos.com' }]

//Metodo GET para leer los datos
app.get('/', (req, res) => {
    const arrUsuarios = arrJsnUsuarios; //Tomo los usuarios
    //Regresamos el estatus
    if (arrUsuarios.length > 0) {
        return res.status(200).json({
            ok: true,
            msg: 'Se regresaron los usuarios de manera exitosa',
            cont: {
                arrUsuarios //El cont junto con el JSON muestra los valores dentro del arreglo
            }
        })
    } else {
        return res.status(400).json({
            ok: false,
            msg: 'No ha datos en el arreglo de usuarios',
        })
    }
})
//segundo metodo GET que recibe un idUsuario y regresa los atributos del usuario de ese ID
app.get('/obtenerUsuario', (req, res) => {
    const _id = req.body._id;//obtenemos el param de idUsuario enviado
    if (_id) { //Si id no fue mandando, debe regresar un error
        //Barremos el arreglo buscando el match del ID
        for (var index = 0; index < arrJsnUsuarios.length; ++index) {
            var usuario = arrJsnUsuarios[index];
            if (usuario._id == _id)
                //Si lo encontro, mandamos el estatus correcto
                return res.status(200).json({
                    ok: true,
                    msg: 'Se encontro el usuario: ' + _id,
                    cont: {
                        usuario
                    }
                })
        }
        //si llego aqui es que no lo encontro y mandamos estatus incorrecto
        return res.status(400).json({
            ok: false,
            msg: 'No se econtro el usuario: ' + _id,
            cont: {
                arrJsnUsuarios
            }
        })
    }
    //Si llego aqui es que no se mando usuario y manda estatus incorrecto
    return res.status(400).json({
        ok: false,
        msg: 'No se recibio usuario',
        cont: {

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
        /* Comprobando si el usuario existe en la matriz. */
        if (!hasMatch) { //Si no encontro un match
            //Creamos una variable con esos valores para el arreglo
            const body = { _id: +req.body._id, strNombre: req.body.strNombre, strApellido: req.body.strApellido, strEmail: req.body.strEmail }
            arrJsnUsuarios.push(body); //Lo insertamos en el arreglo
            //Regresamos el estatus
            return res.status(200).json({
                ok: true,
                msg: 'Se recibio el usuario con id: ' + _id,
                usr: {
                    body
                },
                cont: {
                    arrJsnUsuarios
                }
            })
        } else {//Se encontro un match
            //Regresamos el estatus
            return res.status(400).json({
                ok: false,
                msg: 'Se recibio un id repetido: ' + _id
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
    /* Obtener el valor de la propiedad _id del cuerpo de la solicitud. */
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
                msg: 'Se elimino el usuario con id: ' + _id,
                cont: {
                    arrJsnUsuarios
                }
            })
        } else {//Si no encontro el usuario
            //Regresa el estatus
            return res.status(400).json({
                ok: false,
                msg: 'No se encontro el id:' + _id
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
                msg: 'Se actualizo el usuario con id ' + _id,
                usr: {
                    usuario
                },
                cont: {
                    arrJsnUsuarios
                }
            })
        } else {//Si no se encontro ID
            //Regresamos el estatus
            return res.status(400).json({
                ok: false,
                msg: 'No se encontro el ID ' + _id
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

/////////////////////////////////
//Mongoose con MongoDB en la ruta
/////////////////////////////////

//para usar el schema de usuario
const UsuarioModel = require('../../models/usuario/usuario.model');
//Metodo GET desde MongoDB
app.get('/MongoDB', async (req, res) => {
    //obtenemos los usuarios con FIND
    const blnEstado = req.query.blnEstado == 'false' ? false: true;
    const obtenerUsuario = await UsuarioModel.find({blnEstado:blnEstado});
    //si existen usuarios
    if (obtenerUsuario.length != 0) {
        //Regresamos los usuarios
        return res.status(200).json({
            ok: true,
            msg: 'Se obtuvieron los usuarios correctamente',
            cont: {
                obtenerUsuario
            }
        })
    }
    //regresamos estatus de error
    return res.status(400).json({
        ok: false,
        msg: 'No se encontraron usuarios',
        cont: {
            obtenerUsuario
        }
    })
})

app.post('/MongoDB', async (req, res) => {
    /* Una forma de crear un nuevo objeto con las mismas propiedades que el objeto req.body, pero con
    la contraseña cifrada. */
    //instruccion ternaria: condicion? verdadero : falso
    const body = { ...req.body, strContrasena: req.body.strContrasena ? bcrypt.hashSync(req.body.strContrasena, 10) : undefined };
    const usuarioBody = new UsuarioModel(body);
    const err = usuarioBody.validateSync();
    if (err) {
        return res.status(400).json({
            ok: false,
            msg: 'No se recibio uno o mas campos, favor de validar',
            cont: {
                err
            }
        })
    }
    const obtenerUsuario = await UsuarioModel.find();
    for (var index = 0; index < obtenerUsuario.length; ++index) {
        var usuario = obtenerUsuario[index];
        if (usuario.strEmail == usuarioBody.strEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Se recibio un correo ya existente: ' + usuario.strEmail
            })
            break;
        }
        if (usuario.strNombreUsuario == usuarioBody.strNombreUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Se recibio un nombreUsuario ya existente: ' + usuario.strNombreUsuario
            })
            break;
        }
    }
    const usuarioRegistrado = await usuarioBody.save();
    /* Una solución alternativa para ocultar la contraseña de la respuesta. */
    usuarioRegistrado.strContrasena = "No se puede mostrar pero no supe como borrarla antes del return"
    return res.status(200).json({
        ok: true,
        msg: 'El usuario se recibio de manera exitosa',
        cont: {
            usuarioRegistrado
        }
    })
})

app.put('/MongoDB', async (req, res) => {
    try {
        //leemos los datos enviados

        const _idUsuario = req.query._idUsuario;
        if (!_idUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No se recibio el id',

            })
        }
        const encontrarUsuario = await UsuarioModel.findOne({ _id: _idUsuario, blnEstado:true })
        if (!encontrarUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no se encuentra registrado',
                cont: {
                    _idUsuario
                }
            })
        }
        const body = req.body
        const existeUsuario = await UsuarioModel.findOne({ strNombreUsuario: req.body.strNombreUsuario })

        if (body.strNombreUsuario) {
            if (existeUsuario) {
                return res.status(400).json({
                    ok: true,
                    msg: 'El usuario ya existe y no se logro actualizar',
                    cont: {
                        body
                    }
                })
            } else {
                const actualizarUsuario = await UsuarioModel.findByIdAndUpdate(_idUsuario, { $set: { strNombre: req.body.strNombre, strApellido: req.body.strApellido, strDireccion: req.body.strDireccion, strNombreUsuario: req.body.strNombreUsuario } }, { new: true })
                if (!actualizarUsuario) {
                    return res.status(400).json({
                        ok: true,
                        msg: 'El usuario no se logro actualizar',
                        cont: {
                            body
                        }
                    })
                }
                return res.status(200).json({
                    ok: true,
                    msg: 'Se actualizo el usuario',
                    cont: {
                        usuarioAnterior: encontrarUsuario,
                        usuarioNuevo: actualizarUsuario
                    }
                })
            }
        } else {

            const actualizarUsuario = await UsuarioModel.findByIdAndUpdate(_idUsuario, { $set: { strNombre: req.body.strNombre, strApellido: req.body.strApellido, strDireccion: req.body.strDireccion } }, { new: true })
            if (!actualizarUsuario) {
                return res.status(400).json({
                    ok: true,
                    msg: 'El usuario no se logro actualizar',
                    cont: {
                        body
                    }
                })
            }
            return res.status(200).json({
                ok: true,
                msg: 'Se actualizo el usuario',
                cont: {
                    usuarioAnterior: encontrarUsuario,
                    usuarioNuevo: actualizarUsuario
                }
            })
        }




    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                error
            }
        })
    }
})

app.delete('/MongoDB', async (req, res) => {
    try {
        //leemos los datos enviados
        const _idUsuario = req.query._idUsuario;
        const blnEstado = req.query.blnEstado == 'false' ? false: true;

        if (!_idUsuario || _idUsuario.length != 24) {
            return res.status(400).json({
                ok: false,
                msg: _idUsuario ? 'El identificador no es valido' : 'No se recibio id de usuario',
                cont: {
                    blnEstado,
                _idUsuario
                }
            })
        }
        const encontrarUsuario = await UsuarioModel.findOne({ _id: _idUsuario})
        if (!encontrarUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no se encuentra registrado',
                cont: {
                    _idUsuario
                }
            })
        }
        const borrarUsuario = await UsuarioModel.findByIdAndUpdate(_idUsuario, {blnEstado:blnEstado}, {new:true})
        if (!borrarUsuario) {
            return res.status(400).json({
                ok: false,
                msg: blnEstado == false? 'El usuario no se pudo desactivar': 'El usuario no se pudo activar',
                cont: {
                    borrarUsuario
                }
            })
        }
            return res.status(200).json({
                ok: true,
                msg: blnEstado == false? 'Se desactivo el usuario': 'Se activo el usuario',
                cont: {
                    borrarUsuario
                }
            })
        
        
       
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                error
            }
        })
    }
})
//Para poder usar Express
module.exports = app;