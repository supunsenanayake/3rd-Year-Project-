var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('newsFeed');
});

router.get('/nor', function(req, res, next) {
    res.render('newsFeed', {layout:normal2});
});

module.exports = router;