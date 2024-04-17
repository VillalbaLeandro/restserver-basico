const { response } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')

const login = async (req, res = response) => {

    const { correo, password } = req.body

    try {
        // Verificar si el usuario existe 
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - correo'
            })
        }
        // El usuario esta activo? 
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario se encuentra deshabilitado'
            })
        }

        // Verificar contraseña 
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - password'
            })
        }

        // Generar JWT 
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.json({
            msg: 'Hanle con el administrador'
        })
    }

}


module.exports = {
    login
}