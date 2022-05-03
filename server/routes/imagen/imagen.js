const express = require("express");
const fs = require('fs')
const path = require('path')
const app = express.Router();

app.get('/:ruta/:nameImg', async (req, res) => {
    try {
        const ruta = req.params.ruta
        const nameImg = req.params.nameImg;
        const rutaImagen = path.resolve(__dirname,'../../../uploads/'+ruta+'/'+nameImg)
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


module.exports = app;