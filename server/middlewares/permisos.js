const jwt = require('jsonwebtoken')

const verificarAcceso = async (req, res, next) => {
    try {
        const token = req.get('token')
        if (!token) {
            return res.status(400).json({
                ok: false,
                msg: 'No se recibio token',
                cont: {
                    token
                }
            })
        }
        jwt.verify(token, process.env.SEED, (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msg: err.name == 'JsonWebTokenError'? 'Error, token invalido' : 'Token expirado'
                    
                })
            }
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