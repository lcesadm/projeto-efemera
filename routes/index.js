const express = require('express');
const router = express.Router();
const {check, validationResult, body} = require('express-validator');
const path = require('path');
const fs = require('fs');
const auth = require('../middlewares/auth');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join('public/uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname )
    }
  })
  var upload = multer({ storage: storage })

const homeController = require('../controllers/homeController');
const adminController = require('../controllers/adminController');


   
 


router.get('/', homeController.index);
router.post('/contato', homeController.contato);
router.get('/newsletter', homeController.newsletter);

router.get('/cadastro', homeController.pagCadastro);
router.post('/cadastro',upload.any(),[
    check('nome').isLength({min:3}).withMessage("O nome deve conter no minímo 3 caracteres"),
    check('senha').isLength({min:3}).withMessage("A senha deve conter no minímo 3 caracteres"),
    body('email').custom( email => {
        
        let caminho = path.join('db' , 'usuarios.json');                

        let info = fs.readFileSync( caminho, { encoding:'utf-8' });       
        let usuario = JSON.parse(info); 
        let existe = 0;       
        for (const user of usuario) {
             if(user.email === email) {
                existe ++;
                return;
             }           
        }  
        
        return existe == 0;      

    }).withMessage("E-mail ja cadastrado!")
], homeController.cadastrarUsuario);

router.get('/login',homeController.pagLogin);
router.post('/login',homeController.login);

router.get('/admin',auth, adminController.index);

module.exports = router;
