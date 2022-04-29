const { response } = require('express');
const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt')
const { verificarAcceso } = require('../../middlewares/permisos')

/////////////////////////////////
//Mongoose con MongoDB en la ruta
/////////////////////////////////

//para usar el schema de usuario
const ApiModel = require('../../models/permisos/api.model');
//Metodo GET desde MongoDB

app.post('/MongoDB',verificarAcceso, async (req, res) => {
    const body = req.body;
    const bodyApi =  new ApiModel(body);
    const err = bodyApi.validateSync();
    if (err){
        return res.status(400).json({
            ok:false,
            msg: 'uno o mas campos no se registraron, favor de ingresarlos',
            cont: {
                err
            }
        })
    }
    
    const enncontroApi = await ApiModel.findOne({strRuta: bodyApi.strRuta},{strRuta:1})
    if(enncontroApi){
        return res.status(400).json({
            ok:false,
            msg: 'la ruta ya se encuentra registrado',
            cont: {
                enncontroApi
            }
        })
    }
    const registroApi = await bodyApi.save();
    return res.status(200).json({
        ok:false,
        msg: 'La ruta se registro de manera exitosa',
        cont: {
            registroApi
        }
    })
})