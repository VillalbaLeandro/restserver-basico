const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { esRolValido, mailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet,
    usuariosPut,
    usuariosDelete,
    usuariosPost,
    usuariosPatch } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet)

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id', 'El id no existe').custom((id) => existeUsuarioPorId(id)),
    check('rol').optional().custom((rol) => esRolValido(rol)),
    validarCampos
], usuariosPut)


router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mas de 6 caracteres').isLength({ min: 6 }).not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail().not().isEmpty(),
    check('correo', 'El correo ya existe - desde ruta').custom((correo) => mailExiste(correo)),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom((rol) => esRolValido(rol)),
    validarCampos
], usuariosPost)



router.delete('/:id',[
    check('id', 'No es un id válido').isMongoId(),
    check('id', 'El id no existe').custom((id) => existeUsuarioPorId(id)),
    validarCampos
] ,usuariosDelete)
router.patch('/', usuariosPatch)

module.exports = router;