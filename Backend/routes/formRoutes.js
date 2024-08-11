var express = require("express");
const formControllers = require("../controllers/formControllers");
var router = express.Router();

router.get('/All', (req, res)=>{
    formControllers.getAllForms(req, res);
});
router.get('/FormById/:formId', (req, res)=>{
    formControllers.getFormByUserId(req, res);
});

router.post('/Create', (req, res)=>{
    formControllers.createAForm(req, res);
});

router.put('/Delete/:formId', (req, res)=>{
    formControllers.deleteAForm(req, res);
});

module.exports = router;