const jwt = require('jsonwebtoken')

const verificarAcceso = async (req, res, next) => {
    try {
        const url = req.originalUrl.split("?")[0]

        const token = req.get('token')
        if (!token) {
            return res.status(400).json({
                ok: false,
                msg: 'No se recibio token, se nego el acceso a ' + url + ' con el metodo ' + req.method,
                cont: {
                    token
                }
            })
        }
        jwt.verify(token, process.env.SEED, (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msg: err.name == 'JsonWebTokenError'? 'Error, token invalido, se nego el acceso a ' + url + ' con el metodo ' + req.method : 'Token expirado, se nego el acceso a ' + url + ' con el metodo ' + req.method
                })
            }
            console.log('Se autorizo acceso a ' + url + ' con el metodo ' + req.method)
            next();
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
}
module.exports = { verificarAcceso }