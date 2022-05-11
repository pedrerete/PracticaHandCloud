const jwt = require('jsonwebtoken'); //token para eguridad
require('../config/config'); //Variables globales 
const UsuarioModel = require('../models/usuario/usuario.model'); //shema de usuario
const ApiModel = require('../models/permisos/api.model'); //schema de api, no se usa
const RolModel = require('../models/permisos/rol.model');//schema de rol, no se usa
const ObjectId = require('mongoose').Types.ObjectId;//para convetir strings a objectId


const verificarAcceso = async (req, res, next) => {
    try {
        const url = req.originalUrl.split("?")[0] //tomamos la parte importante de la url a la que se quiere acceder, quitando parametros

        const token = req.get('token')//tomamos el token
        //si no se mando token, se regresa un error
        if (!token) {
            return res.status(400).json({
                ok: false,
                msg: 'No se recibio token, se nego el acceso a ' + url + ' con el metodo ' + req.method,
                cont: {
                    token
                }
            })
        }
        //verificamos que el token sea correcto
        jwt.verify(token, process.env.SEED, async (err, decoded) => {
            if (err) {//si hubo un error, regresa el error
                return res.status(400).json({
                    ok: false,
                    msg: err.name == 'JsonWebTokenError' ? 'Error, token invalido, se nego el acceso a ' + url + ' con el metodo ' + req.method : 'Token expirado, se nego el acceso a ' + url + ' con el metodo ' + req.method
                })
            }
            //si no viene un usuario en el token, se manda error
            if (!decoded.usuario._id) {
                return res.status(400).json({
                    ok: false,
                    msg: "No se recibio el ID del usuario",
                    cont: {
                        usuario: decoded.usuario
                    }
                })
            }
            //se busca en la BD el rol y las apis de ese usuario
            const [obtenerUsuario] = await UsuarioModel.aggregate(
                [{
                    $match: { blnEstado: true } //que este activo
                },
                {
                    $match: { _id: ObjectId(decoded.usuario._id) } //solo el usuario que se mando en el token
                },
                {
                    $lookup: {
                        from: 'rols',
                        let: { rolUsuario: '$_idObjRol' },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$_id', '$$rolUsuario'] } } }, //tomamos el rol
                            {
                                $lookup: {
                                    from: 'apis',
                                    let: { arrObjIdApis: '$arrObjIdApis' },
                                    pipeline: [
                                        { $match: { $expr: { $in: ['$_id', '$$arrObjIdApis'] } } } //tomamos las apis del rol
                                    ],
                                    as: 'apis'
                                }

                            }
                        ],
                        as: 'rol'
                    }
                }, {
                    $project: {
                        blnEstado: 1,
                        strNombre: 1,
                        strApellido: 1,
                        strEmail: 1,
                        strNombreUsuairo: 1,
                        strDireccion: '$strDireccion',
                        _idObjRol: 1,
                        rol: {
                            $arrayElemAt: ['$rol', 0]
                        }
                    }
                }
                ]
            )
            //si no encontro usuario, mandamos error
            if (!obtenerUsuario) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No se encontro el usuario',
                    cont: {
                        usuario: decoded.usuario
                    }
                })

            }
            //si el usuario no tiene rol, mandamos error
            if (!obtenerUsuario.rol) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario no cuenta con un rol valido, favor de verificarlo',
                    cont: {
                        usuario: decoded.usuario
                    }
                })

            }
            if (obtenerUsuario.rol.apis) {
                //si ese rol no tiene apis, regresamos el error
                if (obtenerUsuario.rol.apis.length < 1) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No existen apis para este rol',
                        cont: {
                            usuario: decoded.usuario
                        }
                    })
                }
            } else {
                //el rol esta mal porque no tiene campo de apis
                return res.status(400).json({
                    ok: false,
                    msg: 'No existe el campo de api',
                    cont: {
                        usuario: decoded.usuario
                    }
                })
            }
            //buscamos que la ruta y el metodo al que se quiere acceder ecista dentro de las apis del rol del usuario
            const encontroRuta = obtenerUsuario.rol.apis.find(api => api.strRuta === url & api.strMetodo === req.method)
            //si no encontro nada, no se tiene acceso a esa api con ese metodo
            if (!encontroRuta) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Se nego el acceso a ' + url + ' con el metodo ' + req.method + " por falta de permisos",
                    cont: {
                        usuario: decoded.usuario
                    }
                })
            }
            //vamos a la api con el metodo accedido
            next();
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
}
//expórtamos verificarAcceso para ser usado en las rutas
module.exports = { verificarAcceso }