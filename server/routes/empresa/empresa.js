/* Importación de los módulos. */
const { response } = require('express');
const express = require('express');
const req = require('express/lib/request');
const EmpresaModel = require('../../models/empresa/empresa.model');
const app = express.Router();
const { verificarAcceso } = require('../../middlewares/permisos');
const empresaModel = require('../../models/empresa/empresa.model');
const { subirArchivo } = require('../../library/cargararchivos')


app.get('/producto', verificarAcceso, async (req, res) => {
try{
/* Al verificar si el parámetro de consulta blnEstado es falso, si lo es, establece la variable
blnEstado en falso, de lo contrario, la establece en verdadero. */
    const blnEstado = req.query.blnEstado == 'false' ? false : true;

    const obtenerEmpresa = await EmpresaModel.aggregate(
        [{
            $match: { blnEstado: blnEstado }
        },
        {
           /* Esta es una etapa de búsqueda. Se utiliza para unir dos colecciones. */
            $lookup:
            {
                from: 'productos',
                let: { idEmpresa: '$_id' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$idEmpresa', '$$idEmpresa'] } } }
                ],
                as: 'Productos de la empresa'
            }
        }

        ]
    )
/* Comprobando si la matriz no está vacía. */
    if (obtenerEmpresa.length != 0) {
        return res.status(200).json({
            ok: true,
            msg: 'Se obtuvieron las empresas correctamente',
            cont: {
                obtenerEmpresa
            }
        })
    }
    //regresamos estatus de error
    return res.status(400).json({
        ok: false,
        msg: 'No se encontraron empresas',
        cont: {
            obtenerEmpresa
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

app.get('/usuario', verificarAcceso, async (req, res) => {
try{
/* Verificando si el parámetro de consulta blnEstado es falso, si lo es, pone la variable blnEstado en
falso, en caso contrario, la pone en verdadero. */
    const blnEstado = req.query.blnEstado == 'false' ? false : true;

    const obtenerEmpresa = await EmpresaModel.aggregate(
        [{
            $match: { blnEstado: blnEstado }
        },
        {
            $lookup:
            {
                from: "usuarios",
                localField: "_id",
                foreignField: "idEmpresa",
                as: "Usuarios de la empresa:"
            }
        }

        ]
    )
    /* Comprobando si la matriz no está vacía. */
    if (obtenerEmpresa.length != 0) {
        //Regresamos los usuarios
        return res.status(200).json({
            ok: true,
            msg: 'Se obtuvieron las empresas correctamente',
            cont: {
                obtenerEmpresa
            }
        })
    }
    //regresamos estatus de error
    return res.status(400).json({
        ok: false,
        msg: 'No se encontraron empresas',
        cont: {
            obtenerEmpresa
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

app.get('/',verificarAcceso, async (req, res) => {
    try {
        const blnEstado = req.query.blnEstado == 'false' ? false : true;

        //obtenemos los Empresas con FIND que regresa un arreglo de json... un findOne te regresa un json
        const obtenerEmpresa = await EmpresaModel.find({ blnEstado: blnEstado });

        //si existen Empresas.. si hubieramos usado findOne, podria ser solo con "obtenerEmpresa ==TRUE"
        if (obtenerEmpresa.length != 0) {
            //Regresamos los Empresas
            return res.status(200).json({
                ok: true,
                msg: 'Accedi a la ruta de Empresa',
                cont: {
                    obtenerEmpresa,
                    //obetenerEmpresasAgregate//con aggregate
                }
            })
        }
        //regresamos estatus de error
        return res.status(400).json({
            ok: false,
            msg: 'No se encontraron Empresas',
            cont: {
                obtenerEmpresa
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
        const EmpresaBody = new EmpresaModel(body);
        const err = EmpresaBody.validateSync();
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
            EmpresaBody.strImagen = await subirArchivo(req.files.strImagen, ['image/pgn', 'image/jpg', 'image/jpeg'])
        }
        const obtenerEmpresas = await EmpresaModel.find();
        /* Comprobando si el correo electrónico ya está en la base de datos. */
        for (var index = 0; index < obtenerEmpresas.length; ++index) {
            var empresa = obtenerEmpresas[index];
            if (empresa.strEmail == EmpresaBody.strEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Se recibio un correo ya existente: ' + empresa.strEmail
                })
                break;
            }
        }
        const EmpresaRegistrado = await EmpresaBody.save();
        return res.status(200).json({
            ok: true,
            msg: 'El Empresa se recibio de manera exitosa',
            cont: {
                EmpresaRegistrado
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

app.put('/',verificarAcceso, async (req, res) => {
    try {
        //leemos los datos enviados
        const _idEmpresa = req.query._idEmpresa;
        if (!_idEmpresa || _idEmpresa.length != 24) {
            return res.status(400).json({
                ok: false,
                msg: _idEmpresa ? 'El identificador no es valido' : 'No se recibio id de Empresa',
                cont: {
                    _idEmpresa
                }
            })
        }
        //buscamos el id de empresa
        const encontrarEmpresa = await EmpresaModel.findOne({ _id: _idEmpresa, blnEstado: true })
        if (!encontrarEmpresa) {
            return res.status(400).json({
                ok: false,
                msg: 'El Empresa no se encuentra registrado',
                cont: {
                    _idEmpresa
                }
            })
        }
        const body = req.body
        //si quiere cambiar el mail, hay que validar que no exista
        if (body.strEmail) {
            const obtenerEmpresas = await EmpresaModel.find();
            for (var index = 0; index < obtenerEmpresas.length; ++index) {
                var empresa = obtenerEmpresas[index];
                if (empresa.strEmail == body.strEmail) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Se recibio un correo ya existente: ' + empresa.strEmail
                    })
                    break;
                }
            }
        }
        //buscamos para actuaizar
        const actualizarEmpresa = await EmpresaModel.findByIdAndUpdate(_idEmpresa, body, { new: true })
        if (!actualizarEmpresa) {
            return res.status(400).json({
                ok: true,
                msg: 'El Empresa no se logro actualizar',
                cont: {
                    body
                }
            })
        }

        return res.status(200).json({
            ok: true,
            msg: 'Se actualizo el Empresa',
            cont: {
                EmpresaAnterior: encontrarEmpresa,
                EmpresaNuevo: actualizarEmpresa
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
        const _idEmpresa = req.query._idEmpresa;
        const blnEstado = req.query.blnEstado == 'false' ? false : true;
       
        if(!_idEmpresa || _idEmpresa.length != 24)
        {
            console.log(blnEstado);
            console.log(_idEmpresa);
            return res.status(400).json({
                ok:false,
                msg: _idEmpresa ? 'El identificador no es valido' : 'No se recibio id de la empresa',
                cont:{
                    blnEstado,
                    _idEmpresa
                }
            })
        }
        const encontroEmpresa = await EmpresaModel.findOne({_id: _idEmpresa});
        if(!encontroEmpresa){
            return res.status(400).json({
                ok: false,
                msg: 'La empresa no se encuentra registrada',
                cont:{
                    _idEmpresa
                }
            })
        }
        const modificarEstadoEmpresa = await empresaModel.findByIdAndUpdate({_id: _idEmpresa},{$set:{blnEstado: blnEstado}},{new:true});
        if(!modificarEstadoEmpresa){
            return res.status(400).json({
                ok:false,
                msg:blnEstado == false ? 'La empresa no se logro desactivar' : 'No se logro activar la empresa',
                cont:{
                    modificarEstadoEmpresa
                }
            })
        }
        return res.status(200).json({
            ok:true,
            msg: blnEstado==false ? 'Se desactivo la empresa correctamente' : 'Se activo la empresa de manera exitosa',
            cont:{
                modificarEstadoEmpresa
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
//Para poder usar Express
module.exports = app;