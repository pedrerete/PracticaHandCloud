const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const uniqid = require('uniqid')
const fs = require('fs')
const path = require('path')
const res = require('express/lib/response')
app.use(fileUpload)

const subirArchivo = async (file, exts) =>{
    try{
        //si no se manda archivo
        if(!file){
            throw new Error('No se mando archivo valido')
        }
        //si no se recibe un archivo con las extensiones adecuadas
        if(!exts.includes(file.mimetype)){
            throw new Error('Solo las extensiones: ' + exts.join(', ') + ' son aceptadas')
        }
        //se crea el nombre de la iamgen y se guarda en el servidor
        let nameImg = uniqid()  +  path.extname(file.name)
        await file.mv(path.resolve(__dirname,'../../uploads/'  + nameImg )).catch(error=>{
            console.log(error)
            throw new Error('No se pudo subir el archivo al servidor')
        })
        return(nameImg)
    }catch  (error){
        const err = Error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont:{
                err: err.message ? err.message : err.name ? err.name : err
            }
        })

    }   
}
module.exports = {subirArchivo}