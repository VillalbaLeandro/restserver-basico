const Role = require('../models/rol')
const Usuario = require('../models/usuario')

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
        throw new Error(`El rol ${rol} indicado no es valido`)
    }
}

const mailExiste = async (correo = '') => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo })
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya esta registrado`)
    }

}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id ingresado no existe`)
    }
}

module.exports = {
    esRolValido,
    mailExiste,
    existeUsuarioPorId
}