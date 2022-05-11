const express = require("express");
const fs = require('fs')
const path = require('path')
const app = express.Router();

const { verificarAcceso } = require('../../middlewares/permisos')
const imagenModel = require('../../models/imagen/imagen.model');

app.get('/visual/:nameImg',verificarAcceso, async (req, res) => {
    try {
        const nameImg = req.params.nameImg;
        const rutaImagen = path.resolve(__dirname,'../../../uploads/'+nameImg)
        const noimage = path.resolve(__dirname,'../../assets/default.png')
        if(fs.existsSync(rutaImagen)){
            return res.sendFile(rutaImagen)
        }else{
            return res.sendFile(noimage)
        }
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

app.put('/', verificarAcceso, async (req, res) => {
    try {
        //leemos los datos enviados
        const _idImagen = req.query._idImagen;
        if (!_idImagen || _idImagen.length != 24) {
            return res.status(400).json({
                ok: false,
                msg: _idImagen ? 'El identificador no es valido' : 'No se recibio id de imagen',
                cont: {
                    _idImagen
                }
            })
        }
        const encontrarImagen = await imagenModel.findOne({ _id: _idImagen, blnEstado: true })
        if (!encontrarImagen) {
            return res.status(400).json({
                ok: false,
                msg: 'La imagen no se encuentra registrada',
                cont: {
                    _idImagen
                }
            })
        }
        
        const body = req.body
        if (req.files) {
            if (req.files.strImagen) {
                body.strImagen = await subirArchivo(req.files.strImagen, "", ['image/pgn', 'image/jpg', 'image/jpeg'])
            }
        }

        const actualizarImagen = await imagenModel.findByIdAndUpdate(_idImagen, body, { new: true })
        if (!actualizarImagen) {
            return res.status(400).json({
                ok: true,
                msg: 'La imagen no se logro actualizar',
                cont: {
                    body
                }
            })
        }

        return res.status(200).json({
            ok: true,
            msg: 'Se actualizo la imagen',
            cont: {
                imagenAnterior: encontrarImagen,
                imagenNueva: actualizarImagen
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