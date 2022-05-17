const express = require('express');
/* Importación de los módulos. */
const { response } = require('express');
const app = express.Router();


/* Importación del modelo. */
const ApiModel = require('../models/permisos/api.model');

app.all('/',  async (req, res) => {
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


module.exports = app;