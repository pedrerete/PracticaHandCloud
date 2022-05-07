const { response } = require('express');
const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt')
const { verificarAcceso } = require('../../middlewares/permisos')

/////////////////////////////////
//Mongoose con MongoDB en la ruta
/////////////////////////////////

//para usar el schema de Rol
const RolModel = require('../../models/permisos/rol.model');
//Metodo GET desde MongoDB

app.get('/MongoDB', verificarAcceso, async (req, res) => {
    try {
        
    const blnEstado = req.query.blnEstado == 'false' ? false : true;

    /* Haciendo una búsqueda de la colección Rol a la colección Apis. */
    /* const obtenerApiRol = await RolModel.aggregate(
        [
            {
                $match: { blnEstado: blnEstado}

            },
            { $lookup:
            {
                from: "apis",
                localField: "arrObjIdApis",
                foreignField: "_id",
                as: "InfoExtra"
            }
        }
        ]
    ) */
        /* Haciendo una búsqueda de la colección Rol a la colección Apis. */
    const obtApiRol2 = await RolModel.aggregate([
        {
            $lookup:{
                from: 'apis',
                let: {arrObjIdApis: '$arrObjIdApis'},
                pipeline:[
                   {$match: {$expr:{$in:['$_id','$$arrObjIdApis']}}}
                ],
                as: 'apis'
            }
        }
    ])
    //si existen roles
    if (obtApiRol2.length != 0) {
        //Regresamos los roles
        return res.status(200).json({
            ok: true,
            msg: 'Se obtuvieron los roles correctamente',
            cont: {
                obtApiRol2
            }
        })
    }
    //regresamos estatus de error
    return res.status(400).json({
        ok: false,
        msg: 'No se encontraron roles',
        cont: {
            obtApiRol2
        }
    })
    } catch (error) {
        const err = Error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont:{
                err: err.message ? err.message : err.name ? err.name : err
            }
        })
    }
})



app.post('/MongoDB', verificarAcceso, async (req, res) => {
    try {
        const body = req.body;
    const bodyRol = new RolModel(body);
    const err = bodyRol.validateSync();
    if (err) {
        return res.status(400).json({
            ok: false,
            msg: 'uno o mas campos no se registraron, favor de ingresarlos',
            cont: {
                err
            }
        })
    }
    if (!body.arrObjIdApis) {
        return res.status(400).json({
            ok: false,
            msg: 'uno o mas campos no se registraron, favor de ingresarlos',
            cont: {
                arrObjIdApis: null
            }
        })
    }
    const enncontroRol = await RolModel.findOne({ strNombre: bodyRol.strNombre }, { strNombre: 1 })
    if (enncontroRol) {
        return res.status(400).json({
            ok: false,
            msg: 'El rol ya se encuentra registradow',
            cont: {
                enncontroRol
            }
        })
    }
    const registroRol = await bodyRol.save();
    return res.status(200).json({
        ok: true,
        msg: 'El rol se registro de manera exitosa',
        cont: {
            registroRol
        }
    })
    } catch (error) {
        const err = Error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont:{
                err: err.message ? err.message : err.name ? err.name : err
            }
        })
    } 
})

app.delete('/',  async (req, res) => {
    try {
        //leemos los datos enviados
        const _idRol = req.query._idRol;
        const blnEstado = req.query.blnEstado == 'false' ? false : true;

        if (!_idRol || _idRol.length != 24) {
            return res.status(400).json({
                ok: false,
                msg: _idRol ? 'El identificador no es valido' : 'No se recibio id del rol',
                cont: {
                    blnEstado,
                    _idRol
                }
            })
        }
        const encontrarRol = await RolModel.findOne({ _id: _idRol })
        if (!encontrarRol) {
            return res.status(400).json({
                ok: false,
                msg: 'El Rol no se encuentra registrado',
                cont: {
                    _idRol
                }
            })
        }
        const modificarEstadoRol = await RolModel.findByIdAndUpdate(_idRol, {$set: {blnEstado: blnEstado }}, { new: true })
        if (!modificarEstadoRol) {
            return res.status(400).json({
                ok: false,
                msg: blnEstado == false ? 'El Rol no se pudo desactivar' : 'El Rol no se pudo activar',
                cont: {
                    modificarEstadoRol
                }
            })
        }
        return res.status(200).json({
            ok: true,
            msg: blnEstado == false ? 'Se desactivo el Rol' : 'Se activo el Rol',
            cont: {
                modificarEstadoRol
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

module.exports = app;