const express = require("express");
const fs = require('fs')
const path = require('path')
const app = express.Router();

const { verificarAcceso } = require('../../middlewares/permisos')
const imagenModel = require('../../models/imagen/imagen.model');
const { subirArchivo } = require('../../library/cargararchivos')

app.get('/visual/:nameImg', async (req, res) => {
    try {
        const nameImg = req.params.nameImg;
        const rutaImagen = path.resolve(__dirname, '../../../uploads/' + nameImg)
        const noimage = path.resolve(__dirname, '../../assets/default.png')
        if (fs.existsSync(rutaImagen)) {
            return res.sendFile(rutaImagen)
        } else {
            return res.sendFile(noimage)
        }
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

app.get('/', verificarAcceso, async (req, res) => {
    try {
        const blnEstado = req.query.blnEstado == 'false' ? false : true;

        const obtenerImagen = await imagenModel.find({ blnEstado: blnEstado });

        if (obtenerImagen.length != 0) {
            return res.status(200).json({
                ok: true,
                msg: 'Accedi a la ruta de imagen',
                cont: {
                    obtenerImagen,
                }
            })
        }
        //regresamos estatus de error
        return res.status(400).json({
            ok: false,
            msg: 'No se encontraron imagenes',
            cont: {
                obtenerImagen
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

app.post('/', verificarAcceso, async (req, res) => {
    try {
        /* Validación del cuerpo de la solicitud. */
        const body = req.body;
        const imagenBody = new imagenModel(body);
        const err = imagenBody.validateSync();
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'No se recibio uno o mas campos, favor de validar',
                cont: {
                    err
                }
            })
        }
        /* Al verificar si la solicitud tiene un archivo, si lo tiene, verifica si el archivo es una
        imagen, si lo es, carga la imagen. */
        if (req.files) {

            if (!req.files.strImagen) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No se recibio archivo de imagen'
                })
            }
            
        }else{
            return res.status(400).json({
                ok: false,
                msg: 'No se recibio archivo'
            })
        }
        imagenBody.strImagen = await subirArchivo(req.files.strImagen, ['image/pgn', 'image/jpg', 'image/jpeg'])
        const imagenRegistrada = await imagenBody.save();
        return res.status(200).json({
            ok: true,
            msg: 'La imagen se recibio de manera exitosa',
            cont: {
                imagenRegistrada
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
                body.strImagen = await subirArchivo(req.files.strImagen, ['image/pgn', 'image/jpg', 'image/jpeg'])
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

app.delete('/', verificarAcceso, async (req, res) => {
    try {
        const _idImagen = req.query._idImagen;
        const blnEstado = req.query.blnEstado == 'false' ? false : true;

        if (!_idImagen || _idImagen.length != 24) {
            console.log(blnEstado);
            console.log(_idImagen);
            return res.status(400).json({
                ok: false,
                msg: _idImagen ? 'El identificador no es valido' : 'No se recibio id de la imagen',
                cont: {
                    blnEstado,
                    _idImagen
                }
            })
        }
        const encontroImagen = await imagenModel.findOne({ _id: _idImagen });
        if (!encontroImagen) {
            return res.status(400).json({
                ok: false,
                msg: 'La imagen no se encuentra registrada',
                cont: {
                    _idImagen
                }
            })
        }
        const modificarEstadoImagen = await imagenModel.findByIdAndUpdate({ _id: _idImagen }, { $set: { blnEstado: blnEstado } }, { new: true });
        if (!modificarEstadoImagen) {
            return res.status(400).json({
                ok: false,
                msg: blnEstado == false ? 'La imagen no se logro desactivar' : 'No se logro activar la imagen',
                cont: {
                    modificarEstadoImagen
                }
            })
        }
        return res.status(200).json({
            ok: true,
            msg: blnEstado == false ? 'Se desactivo la imagen correctamente' : 'Se activo la imagen de manera exitosa',
            cont: {
                modificarEstadoImagen
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