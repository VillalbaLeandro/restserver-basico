const { Router } = require('express');
const { usuariosGet,
    usuariosPut,
    usuariosDelete,
    usuariosPost,
    usuariosPatch } = require('../controllers/usuarios');
const { check } = require('express-validator');
const Role = require('../models/rol')
const { validarCampos } = require('../middlewares/validar-campos')

const router = Router();

router.get('/', usuariosGet)
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mas de 6 caracteres').isLength({ min: 6 }).not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail().not().isEmpty(),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(async(rol='') => {
        const existeRol = await Role.findOne({rol})
        if(!existeRol){
            throw new Error(`El rol ${ rol } no esta registrado en la base de datos`)
        }
    }),
    validarCampos
], usuariosPost)
router.put('/:id', usuariosPut)
router.delete('/', usuariosDelete)
router.patch('/', usuariosPatch)

module.exports = router;