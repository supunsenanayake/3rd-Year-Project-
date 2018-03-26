var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {layout: 'landing'});
});

router.get('/home', function(req, res, next) {
    res.render('home', {layout: 'normal'});
});

router.get('/event', function(req, res, next) {
    res.render('event');
});

router.get('/event2', function(req, res, next) {
    res.render('newsFeed', {layout: 'normal2'});
});



module.exports = router;
