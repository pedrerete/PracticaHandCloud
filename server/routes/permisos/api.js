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
app.get('/',verificarAcceso,  async (req, res) => {
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


app.post('/', verificarAcceso, async (req, res) => {
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

    const enncontroApi = await ApiModel.findOne({ strRuta: bodyApi.strRuta, strMetodo: bodyApi.strMetodo }, { strRuta: 1 })
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

//delete de API ya quedo 
//put de API 
app.put('/', verificarAcceso, async (req, res) => {
    try {
        //leemos los datos enviados
        const _idApi = req.query._idApi;
        if (!_idApi || _idApi.length != 24) {
            return res.status(400).json({
                ok: false,
                msg: _idApi ? 'El identificador no es valido' : 'No se recibio id del api',
                cont: {
                    _idApi
                }
            })
        }
        const encontrarApi = await ApiModel.findOne({ _id: _idApi, blnEstado: true })
        if (!encontrarApi) {
            return res.status(400).json({
                ok: false,
                msg: 'El api no se encuentra registrado',
                cont: {
                    encontrarApi
                }
            })
        }
        const body = req.body
        const actualizarApi = await ApiModel.findByIdAndUpdate(_idApi, body, { new: true })
        if (!actualizarApi) {
            return res.status(400).json({
                ok: true,
                msg: 'El api no se logro actualizar',
                cont: {
                    body
                }
            })
        }

        return res.status(200).json({
            ok: true,
            msg: 'Se actualizo el api',
            cont: {
                ApiAnterior: encontrarApi,
                ApiNuevo: actualizarApi
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


app.delete('/',verificarAcceso, async(req,res) =>{
    try{
        const _idApi = req.query._idApi;
        const blnEstado = req.query.blnEstado == 'false' ? false : true;
       
        if(!_idApi || _idApi.length != 24)
        {
            console.log(blnEstado);
            console.log(_idApi);
            return res.status(400).json({
                ok:false,
                msg: _idApi ? 'El identificador no es valido' : 'No se recibio id de la api',
                cont:{
                    blnEstado,
                    _idApi
                }
            })
        }
        const encontroApi = await ApiModel.findOne({_id: _idApi});
        if(!encontroApi){
            return res.status(400).json({
                ok: false,
                msg: 'La api no se encuentra registrada',
                cont:{
                    _idApi
                }
            })
        }
        const modificarEstadoApi = await ApiModel.findByIdAndUpdate({_id: _idApi},{$set:{blnEstado: blnEstado}},{new:true});
        if(!modificarEstadoApi){
            return res.status(400).json({
                ok:false,
                msg:blnEstado == false ? 'La api no se logro desactivar' : 'No se logro activar la api',
                cont:{
                    modificarEstadoApi
                }
            })
        }
        return res.status(200).json({
            ok:true,
            msg: blnEstado==false ? 'Se desactivo la api correctamente' : 'Se activo la api de manera exitosa',
            cont:{
                modificarEstadoApi
            }
                })

    }catch(error){
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
