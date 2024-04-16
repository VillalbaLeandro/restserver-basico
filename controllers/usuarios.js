const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');



const usuariosGet = (req = request, res = response) => {
    const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;
    res.json({
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    })
}
const usuariosPost = async (req, res) => {


    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo })
    if (existeEmail) {
        return res.status(400).json({
            msg: 'Ese correo ya esta registrado'
        })
    }
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); //Numero de vueltas, por defecto 10
    usuario.password = bcryptjs.hashSync(password, salt) //se llama a password que es la propiedad que esta en el Modelo Usuario. 

    // Guardar en BD
    await usuario.save();
    res.json({
        usuario
    })
}
const usuariosPut = (req, res) => {
    const id = req.params.id;
    res.json({
        msg: 'put API',
        id
    })
}
const usuariosPatch = (req, res) => {
    res.json({
        msg: 'Patch API'
    })
}
const usuariosDelete = (req, res) => {
    res.json({
        msg: 'delete API'
    })
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}