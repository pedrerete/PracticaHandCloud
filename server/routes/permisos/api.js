const { response } = require('express');
const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt')
const { verificarAcceso } = require('../../middlewares/permisos')

/////////////////////////////////
//Mongoose con MongoDB en la ruta
/////////////////////////////////

//para usar el schema de api
const ApiModel = require('../../models/permisos/api.model');
//Metodo GET desde MongoDB
app.get('/MongoDB', verificarAcceso, async (req, res) => {
   try {
        //obtenemos las apis con FIND
    const obtenerApi = await ApiModel.find();
    //si existen apis
    if (obtenerApi.length != 0) {
        //Regresamos las apis
        return res.status(200).json({
            ok: true,
            msg: 'Se obtuvieron las apis correctamente',
            cont: {
                obtenerApi
            }
        })
    }
    //regresamos estatus de error
    return res.status(400).json({
        ok: false,
        msg: 'No se encontraron apis',
        cont: {
            obtenerApi
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
    const bodyApi = new ApiModel(body);
    const err = bodyApi.validateSync();
    if (err) {
        return res.status(400).json({
            ok: false,
            msg: 'uno o mas campos no se registraron, favor de ingresarlos',
            cont: {
                err
            }
        })
    }

    const enncontroApi = await ApiModel.findOne({ strRuta: bodyApi.strRuta }, { strRuta: 1 })
    if (enncontroApi) {
        return res.status(400).json({
            ok: false,
            msg: 'la ruta ya se encuentra registrado',
            cont: {
                enncontroApi
            }
        })
    }
    const registroApi = await bodyApi.save();
    return res.status(200).json({
        ok: false,
        msg: 'La ruta se registro de manera exitosa',
        cont: {
            registroApi
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
module.exports = app;