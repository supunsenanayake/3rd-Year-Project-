var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('donation');
});

router.get('/don', function(req, res, next) {
    res.render('donation', {layout:'normal2'});
});

router.get('/addDonation', function(req, res, next) {
    res.render('addDonation');
});

router.get('/addItem', function(req, res, next) {
    res.render('addItem');
});

router.post('/donate', function(req, res, next){
    console.log(req.body.submit);
    if (req.body.submit == 'cancel'){
        res.render('donation');
    }else {
        res.render('donation');
    }
});





module.exports = router;