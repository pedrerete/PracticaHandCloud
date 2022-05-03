const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const uniqid = require('uniqid')
const fs = require('fs')
const path = require('path')
app.use(fileUpload)

const subirArchivo = async (file, route, exts) =>{
    try{
        if(!file){
            throw new Error('No se mando archivo valido')
        }
        if(!exts.includes(file.mimetype)){
           
            throw new Error('Solo las extensiones: ' + exts.join(', ') + ' son aceptadas')
        }
        let nameImg = uniqid()  +  path.extname(file.name)
        await file.mv(path.resolve(__dirname,'../../uploads/' + route + '/' + nameImg )).catch(error=>{
            console.log(error)
            throw new Error('No se pudo subir el archivo al servidor')

        })
        return(nameImg)
    }catch  (error){
        return error
    }   
}
module.exports = {subirArchivo}