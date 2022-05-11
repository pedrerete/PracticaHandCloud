/* Importación de los módulos necesarios. */
const express = require('express');
const app = express.Router();
const UsuarioModel = require('../../models/usuario/usuario.model');
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken')
require('../../config/config') 

app.post('/login', async (req, res) => {
    try {
       /* Tomar los datos enviados por el usuario. */
        const strNombreUsuario = req.body.strNombreUsuario
        const strContrasena = req.body.strContrasena
        const strEmail = req.body.strEmail
        /* Comprobando si el usuario está enviando la contraseña, el nombre de usuario o el correo
        electrónico. */
        if (!strContrasena || (!strNombreUsuario && !strEmail) || (strNombreUsuario && strEmail)) {
            return res.status(400).json({
                ok: false,
                msg: !strEmail && !strNombreUsuario && !strContrasena ? 'No se recibio strEmail. strNombrUsuario ni strContrasena' : !strEmail && !strNombreUsuario ? 'No se recibio strEmail ni strNombre de usuario' : strEmail && strNombreUsuario ? 'Se recibio usuario y correo, favor de mandar solo 1' : !strContrasena ? "No se recibio strContrasena" : "todo bien"
            })
        }
        let encontroUsuario = true
        /* Comprobando si el usuario está en la base de datos. */
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
/* Comparando la contraseña que envió el usuario con la que está almacenada en la base de datos. */
        const compararContrasena = bcrypt.compareSync(strContrasena, encontroUsuario.strContrasena)
        if (!compararContrasena) {
            return res.status(400).json({
                ok: false,
                msg: 'Las credenciales son incorrectas'
            })
        }
/* Creando un token con los datos del usuario y una semilla. */
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