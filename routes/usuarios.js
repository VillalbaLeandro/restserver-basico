const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos,
    validarJWT,
    adminRole,
    tieneRole } = require('../middlewares')

const { esRolValido,
    mailExiste,
    existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
    usuariosDelete,
    usuariosPut,
    usuariosPost,
    usuariosPatch } = require('../controllers/usuarios');
const rolUsuario = require('../utils/roles');

const router = Router();

router.get('/', usuariosGet)

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId()
        .custom((id) => existeUsuarioPorId(id))
        .withMessage('El id no existe'),
    check('rol').optional().custom((rol) => esRolValido(rol)),
    validarCampos
], usuariosPut)


router.post('/', [
    check('nombre', 'El nombre es requerido')
        .notEmpty()
        .isString()
        .withMessage('El nombre solo debe contener letras'),
    check('password', 'La constraseña es requerida')
        .notEmpty(),
    // .matches(regex.password)
    // .withMessage('La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número, un carácter especial y tener al menos 8 caracteres de longitud'),
    check('correo', 'El correo es requerido')
        .notEmpty()
        .isEmail()
        .withMessage('El mail ingresado no es valido')
        .custom((correo) => mailExiste(correo))
        .withMessage('El correo ya se encuentra registrado'),
    check('rol', 'El rol es requerido').custom((rol) => esRolValido(rol)),
    validarCampos
], usuariosPost)



router.delete('/:id', [
    validarJWT,
    // adminRole,
    tieneRole(rolUsuario.admin, rolUsuario.user),
    check('id', 'No es un id válido').isMongoId(),
    check('id', 'El id no existe').custom((id) => existeUsuarioPorId(id)),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch)

module.exports = router;