//Express para el servidor
const { response } = require('express');
const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt')
const { verificarAcceso } = require('../../middlewares/permisos')
const { subirArchivo } = require('../../library/cargararchivos')
/////////////////////////////////
//Mongoose con MongoDB en la ruta
/////////////////////////////////

//para usar el schema de usuario
const UsuarioModel = require('../../models/usuario/usuario.model');
const RolModel = require('../../models/permisos/rol.model');

//Metodo GET desde MongoDB
app.get('/', verificarAcceso, async (req, res) => {
    try {
        //obtenemos los usuarios con FIND
        const blnEstado = req.query.blnEstado == 'false' ? false : true;

        /* Haciendo una búsqueda de la colección UsuarioModel a la colección Empresas. */
        const obtenerUsuario = await UsuarioModel.aggregate(
            [{
                $match:{blnEstado:blnEstado}
            },
                {
                $lookup:
                {
                    from: "empresas",
                    localField: "idEmpresa",
                    foreignField: "_id",
                    as: "InfoEmpresa"
                },
            },
            {
                $lookup: {
                    from: 'rols',
                    let: { rolUsuario: '$_idObjRol' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$rolUsuario'] } } },
                        {
                            $lookup: {
                                from: 'apis',
                                let: { arrObjIdApis: '$arrObjIdApis' },
                                pipeline: [
                                    { $match: { $expr: { $in: ['$_id', '$$arrObjIdApis'] } } }
                                ],
                                as: 'apis'
                            }
                        }
                    ],
                    as: 'InfoRol'
                }
            }
            ]
        )

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
    } catch (error) {
        const err = Error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                err: err.message ? err.message : err.name ? err.name : err
            }
        })
    }
})

app.post('/', async (req, res) => {
    try {

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
        if (!req.body._idObjRol) {
            const encontroRolDefault = await RolModel.findOne({ blnRolDefault: true })
            usuarioBody._idObjRol = encontroRolDefault._id
        }
        const obtenerUsuario = await UsuarioModel.find();
        /* Un ciclo for que recorrerá la matriz de usuarios e imprimirá el nombre de cada usuario. */
        /* Comprobando si el correo electrónico y el nombre de usuario ya existen en la base de datos. */
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
        if (req.files) {
            if (!req.files.strImagen) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No se recibio archivo de imagen'
                })
            }
            usuarioBody.strImagen = await subirArchivo(req.files.strImagen, 'usuarios', ['image/pgn', 'image/jpg', 'image/jpeg'])
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
    } catch (error) {
        const err = Error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                err: err.message ? err.message : err.name ? err.name : err
            }
        })
    }


})


app.put('/', verificarAcceso, async (req, res) => {
    try {
        //leemos los datos enviados

        const _idUsuario = req.query._idUsuario;
        if (!_idUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No se recibio el id',

            })
        }
        const encontrarUsuario = await UsuarioModel.findOne({ _id: _idUsuario, blnEstado: true })
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
                const actualizarUsuario = await UsuarioModel.findByIdAndUpdate(_idUsuario, { $set: { strNombre: req.body.strNombre, strApellido: req.body.strApellido, strDireccion: req.body.strDireccion, strNombreUsuario: req.body.strNombreUsuario, idEmpresa: req.body.idEmpresa } }, { new: true })
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
        const err = Error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                err: err.message ? err.message : err.name ? err.name : err
            }
        })
    }
})

app.delete('/', verificarAcceso, async (req, res) => {
    try {
        //leemos los datos enviados
        const _idUsuario = req.query._idUsuario;
        const blnEstado = req.query.blnEstado == 'false' ? false : true;

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
        const encontrarUsuario = await UsuarioModel.findOne({ _id: _idUsuario })
        if (!encontrarUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no se encuentra registrado',
                cont: {
                    _idUsuario
                }
            })
        }
        const borrarUsuario = await UsuarioModel.findByIdAndUpdate(_idUsuario, { blnEstado: blnEstado }, { new: true })
        if (!borrarUsuario) {
            return res.status(400).json({
                ok: false,
                msg: blnEstado == false ? 'El usuario no se pudo desactivar' : 'El usuario no se pudo activar',
                cont: {
                    borrarUsuario
                }
            })
        }
        return res.status(200).json({
            ok: true,
            msg: blnEstado == false ? 'Se desactivo el usuario' : 'Se activo el usuario',
            cont: {
                borrarUsuario
            }
        })



    } catch (error) {
        const err = Error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                err: err.message ? err.message : err.name ? err.name : err
            }
        })
    }
})
//Para poder usar Express
module.exports = app;