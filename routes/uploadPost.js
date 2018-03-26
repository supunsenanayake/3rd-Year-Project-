var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('uploadPost');
});

router.post('/', function(req, res, next) {
    console.log(req.body.submit);
    if (req.body.submit == 'cancel'){
        res.render('uploadPost');
    }else {
        res.render('uploadPost');
    }
});





module.exports = router;
