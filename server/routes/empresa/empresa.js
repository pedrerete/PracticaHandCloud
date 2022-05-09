//Express para el servidor
const { response } = require('express');
const express = require('express');
const req = require('express/lib/request');
const EmpresaModel = require('../../models/empresa/empresa.model');
const app = express.Router();
const { verificarAcceso } = require('../../middlewares/permisos')


/////////////////////////////////
//Mongoose con MongoDB en la ruta
/////////////////////////////////

//para usar el schema de Empresa
//Metodo GET desde MongoDB
app.get('/producto', async (req,res)=>{

    const blnEstado = req.query.blnEstado == 'false' ? false : true;
    
    const obtenerEmpresa = await EmpresaModel.aggregate(
       [{
           $match:{blnEstado:blnEstado}
       },
           {
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
})

app.get('/usuario', async (req,res)=>{

     const blnEstado = req.query.blnEstado == 'false' ? false : true;
     
     const obtenerEmpresa = await EmpresaModel.aggregate(
        [{
            $match:{blnEstado:blnEstado}
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
})

app.get('/',verificarAcceso, async (req, res) => {
    try {
        const blnEstado = req.query.blnEstado == 'false' ? false : true;

        //obtenemos los Empresas con FIND que regresa un arreglo de json... un findOne te regresa un json
        const obtenerEmpresa = await EmpresaModel.find({ blnEstado: blnEstado });
        

        /* //funcion con agregate
        const blnEstado2 = !blnEstado //para traernos diferentes cosas
        const obetenerEmpresasAgregate = await EmpresaModel.aggregate([
            {
                $project: { strNombre: 1, strPrecio: 1, blnEstado:1 }
            },
            {
                $match:{ blnEstado:blnEstado2}
                //$match: { $expr: { $ne: ["$blnEstado",blnEstado] } } //no tentendi como funciona este
            }
           
        ]);
        //funcion con agregate */

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
    } catch (error) {const err = Error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont:{
                err: err.message ? err.message : err.name ? err.name : err
            }
        })
    }
})

//Metodo GET desde MongoDB
app.post('/',verificarAcceso, async (req, res) => {
    try {
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
        if (req.files) {
            if (!req.files.strImagen) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No se recibio archivo de imagen'
                })
            }
            EmpresaBody.strImagen = await subirArchivo(req.files.strImagen, 'empresas', ['image/pgn', 'image/jpg', 'image/jpeg'])
        }


        const EmpresaRegistrado = await EmpresaBody.save();
        return res.status(200).json({
            ok: true,
            msg: 'El Empresa se recibio de manera exitosa',
            cont: {
                EmpresaRegistrado
            }
        })
    } catch (error) {const err = Error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont:{
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
    } catch (error) {const err = Error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont:{
                err: err.message ? err.message : err.name ? err.name : err
            }
        })
    }
})

app.delete('/',verificarAcceso, async (req, res) => {
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
        const encontrarEmpresa = await EmpresaModel.findOne({ _id: _idEmpresa })
        if (!encontrarEmpresa) {
            return res.status(400).json({
                ok: false,
                msg: 'El Empresa no se encuentra registrado',
                cont: {
                    _idEmpresa
                }
            })
        }
        //const borrarEmpresa = await EmpresaModel.findByIdAndDelete(_idEmpresa) no se debe borrar
        const borrarEmpresa = await EmpresaModel.findByIdAndUpdate(_idEmpresa, { blnEstado: false }, { new: true })

        if (!borrarEmpresa) {
            return res.status(400).json({
                ok: false,
                msg: 'El Empresa no se logro desactivar',
                cont: {
                    borrarEmpresa
                }
            })
        }
        return res.status(200).json({
            ok: true,
            msg: 'Se desactivo el Empresa',
            cont: {
                borrarEmpresa
            }
        })
    } catch (error) {const err = Error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont:{
                err: err.message ? err.message : err.name ? err.name : err
            }
        })
    }
})

//Para poder usar Express
module.exports = app;