const { response } = require('express');
const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt')
const { verificarAcceso } = require('../../middlewares/permisos')

/////////////////////////////////
//Mongoose con MongoDB en la ruta
/////////////////////////////////

//para usar el schema de usuario
const RolModel = require('../../models/permisos/rol.model');
//Metodo GET desde MongoDB

app.post('/MongoDB',verificarAcceso, async (req, res) => {
    const body = req.body;
    const bodyRol =  new RolModel(body);
    const err = bodyRol.validateSync();
    if (err){
        return res.status(400).json({
            ok:false,
            msg: 'uno o mas campos no se registraron, favor de ingresarlos',
            cont: {
                err
            }
        })
    }
    if(!body.arrObjIdApis){
        return res.status(400).json({
            ok:false,
            msg: 'uno o mas campos no se registraron, favor de ingresarlos',
            cont: {
                arrObjIdApis: null
            }
        })
    }
    const enncontroRol = await RolModel.findOne({strNombre: bodyRol.strNombre},{strNombre:1})
    if(enncontroRol){
        return res.status(400).json({
            ok:false,
            msg: 'El rol ya se encuentra registrado',
            cont: {
                enncontroRol
            }
        })
    }
    const registroRol = await bodyRol.save();
    return res.status(200).json({
        ok:false,
        msg: 'El rol se registro de manera exitosa',
        cont: {
            registroRol
        }
    })
})