const jwt = require('jsonwebtoken');
require('../config/config');
const UsuarioModel = require('../models/usuario/usuario.model');
const ApiModel = require('../models/permisos/api.model');
const RolModel = require('../models/permisos/rol.model');
const ObjectId = require('mongoose').Types.ObjectId;


const verificarAcceso = async (req, res, next) => {
    try {
        const url = req.originalUrl.split("?")[0]

        const token = req.get('token')
        if (!token) {
            return res.status(400).json({
                ok: false,
                msg: 'No se recibio token, se nego el acceso a ' + url + ' con el metodo ' + req.method,
                cont: {
                    token
                }
            })
        }
        jwt.verify(token, process.env.SEED, async (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msg: err.name == 'JsonWebTokenError' ? 'Error, token invalido, se nego el acceso a ' + url + ' con el metodo ' + req.method : 'Token expirado, se nego el acceso a ' + url + ' con el metodo ' + req.method
                })
            }
            if (!decoded.usuario._id) {
                return res.status(400).json({
                    ok: false,
                    msg: "No se recibio el ID del usuario",
                    cont: {
                        usuario: decoded.usuario
                    }
                })
            }
            const [obtenerUsuario] = await UsuarioModel.aggregate(
                [{
                    $match: { blnEstado: true }
                },
                {
                    $match: { _id: ObjectId(decoded.usuario._id) }
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
            if (!obtenerUsuario) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No se encontro el usuario',
                    cont: {
                        usuario: decoded.usuario
                    }
                })

            }
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
                return res.status(400).json({
                    ok: false,
                    msg: 'No existe el campo de api',
                    cont: {
                        usuario: decoded.usuario
                    }
                })
            }
            const encontroRuta = obtenerUsuario.rol.apis.find(api => api.strRuta === url & api.strMetodo === req.method)
            if (!encontroRuta) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Se nego el acceso a ' + url + ' con el metodo ' + req.method + " por falta de permisos",
                    cont: {
                        usuario: decoded.usuario
                    }
                })
            }
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
module.exports = { verificarAcceso }