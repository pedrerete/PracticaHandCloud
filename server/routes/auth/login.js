const express = require('express');
const app = express.Router();
const UsuarioModel = require('../../models/usuario/usuario.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('../../config/config')

app.post('/login', async (req, res) => {
    try {
        const strNombreUsuario = req.body.strNombreUsuario
        const strContrasena = req.body.strContrasena
        const strEmail = req.body.strEmail

        if (!strContrasena || (!strNombreUsuario && !strEmail) || (strNombreUsuario && strEmail)) {
            return res.status(400).json({
                ok: false,
                msg: !strEmail && !strNombreUsuario && !strContrasena ? 'No se recibio strEmail. strNombrUsuario ni strContrasena' : !strEmail && !strNombreUsuario ? 'No se recibio strEmail ni strNombre de usuario' : strEmail && strNombreUsuario ? 'Se recibio usuario y correo, favor de mandar solo 1' : !strContrasena ? "No se recibio strContrasena" : "todo bien"
            })
        }
        let encontroUsuario = true
        if (strEmail) {
            encontroUsuario = await UsuarioModel.findOne({ strEmail: strEmail })

        } else {
            encontroUsuario = await UsuarioModel.findOne({ strNombreUsuario: strNombreUsuario })
        }
        if (!encontroUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Las credenciales son incorrectas'
            })
        }

        const compararContrasena = bcrypt.compareSync(strContrasena, encontroUsuario.strContrasena)
        if (!compararContrasena) {
            return res.status(400).json({
                ok: false,
                msg: 'Las credenciales son incorrectas'
            })
        }

        const token = jwt.sign({ usuario: encontroUsuario }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        return res.status(200).json({
            ok: true,
            msg: 'Las credenciales son correctas',
            cont: {
                encontroUsuario,
                token
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


module.exports = app;