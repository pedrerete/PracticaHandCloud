//Express para el servidor
const { response } = require('express');
const express = require('express');
const req = require('express/lib/request');
const ProductoModel = require('../../models/producto/producto.model');
const app = express.Router();
const { verificarAcceso } = require('../../middlewares/permisos')


/////////////////////////////////
//Mongoose con MongoDB en la ruta
/////////////////////////////////

//para usar el schema de producto
//Metodo GET desde MongoDB
app.get('/', verificarAcceso, async (req, res) => {
    try {
        const blnEstado = req.query.blnEstado == 'false' ? false : true;

        //obtenemos los productos con FIND que regresa un arreglo de json... un findOne te regresa un json
        const obtenerProducto = await ProductoModel.find({ blnEstado: blnEstado });

        //funcion con agregate
        const blnEstado2 = !blnEstado //para traernos diferentes cosas
        const obetenerProductosAgregate = await ProductoModel.aggregate([
            {
                $project: { strNombre: 1, strPrecio: 1, blnEstado: 1 }
            },
            {
                $match: { blnEstado: blnEstado2 }
                //$match: { $expr: { $ne: ["$blnEstado",blnEstado] } } //no tentendi como funciona este
            }

        ]);
        //funcion con agregate

        //si existen productos.. si hubieramos usado findOne, podria ser solo con "obtenerproducto ==TRUE"
        if (obtenerProducto.length != 0) {
            //Regresamos los productos
            return res.status(200).json({
                ok: true,
                msg: 'Accedi a la ruta de producto',
                cont: {
                    obtenerProducto,
                    obetenerProductosAgregate//con aggregate
                }
            })
        }
        //regresamos estatus de error
        return res.status(400).json({
            ok: false,
            msg: 'No se encontraron productos',
            cont: {
                obtenerProducto
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

//Metodo GET desde MongoDB
app.post('/', verificarAcceso, async (req, res) => {
    try {
        const body = req.body;
        const productoBody = new ProductoModel(body);
        const err = productoBody.validateSync();
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
            productoBody.strImagen = await subirArchivo(req.files.strImagen, 'productos', ['image/pgn', 'image/jpg', 'image/jpeg'])
        }

        const productoRegistrado = await productoBody.save();
        return res.status(200).json({
            ok: true,
            msg: 'El producto se recibio de manera exitosa',
            cont: {
                productoRegistrado
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
        const _idProducto = req.query._idProducto;
        if (!_idProducto || _idProducto.length != 24) {
            return res.status(400).json({
                ok: false,
                msg: _idProducto ? 'El identificador no es valido' : 'No se recibio id de producto',
                cont: {
                    _idProducto
                }
            })
        }
        const encontrarProducto = await ProductoModel.findOne({ _id: _idProducto, blnEstado: true })
        if (!encontrarProducto) {
            return res.status(400).json({
                ok: false,
                msg: 'El producto no se encuentra registrado',
                cont: {
                    _idProducto
                }
            })
        }
        const body = req.body
        const actualizarProducto = await ProductoModel.findByIdAndUpdate(_idProducto, body, { new: true })
        if (!actualizarProducto) {
            return res.status(400).json({
                ok: true,
                msg: 'El producto no se logro actualizar',
                cont: {
                    body
                }
            })
        }

        return res.status(200).json({
            ok: true,
            msg: 'Se actualizo el producto',
            cont: {
                productoAnterior: encontrarProducto,
                productoNuevo: actualizarProducto
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
        //leemos los datos enviados
        const _idProducto = req.query._idProducto;
        if (!_idProducto || _idProducto.length != 24) {
            return res.status(400).json({
                ok: false,
                msg: _idProducto ? 'El identificador no es valido' : 'No se recibio id de producto',
                cont: {
                    _idProducto
                }
            })
        }
        const encontrarProducto = await ProductoModel.findOne({ _id: _idProducto })
        if (!encontrarProducto) {
            return res.status(400).json({
                ok: false,
                msg: 'El producto no se encuentra registrado',
                cont: {
                    _idProducto
                }
            })
        }
        //const borrarProducto = await ProductoModel.findByIdAndDelete(_idProducto) no se debe borrar
        const borrarProducto = await ProductoModel.findByIdAndUpdate(_idProducto, { blnEstado: false }, { new: true })

        if (!borrarProducto) {
            return res.status(400).json({
                ok: false,
                msg: 'El producto no se logro desactivar',
                cont: {
                    borrarProducto
                }
            })
        }
        return res.status(200).json({
            ok: true,
            msg: 'Se desactivo el producto',
            cont: {
                borrarProducto
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

//Para poder usar Express
module.exports = app;