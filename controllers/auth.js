const { response } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')

const login = async (req, res = response) => {

    const { _id, ...resto } = req.body
    const {correo, password} = resto

    try {
        // Verificar si el usuario existe 
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'El usuario no esta registrado'
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
                msg: 'Usuario o contraseña incorrectos'
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
            msg: 'Hable con el administrador'
        })
    }

}


module.exports = {
    login
}