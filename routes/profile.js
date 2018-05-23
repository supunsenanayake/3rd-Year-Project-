/**
 * profile related controls
 *
 */



// File input field name is simply 'file'


var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

var expressValidator = require('express-validator');
var passport= require('passport');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
//var sha1 = require('sha1');
//var bodyParser = require('body-parser');
var multer  = require('multer');
var fs = require("fs");

var path = require('path');
var appDir = path.dirname(require.main.filename); //www

var url = 'mongodb://localhost:27017';
const dbName= 'sahana';

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(req.isUnauthenticated()){
        res.redirect('/')
    }else {
        res.render('profile', {layout: 'main'});
    }
});

router.get('/viewProfile', function(req, res, next) {
    if(req.isUnauthenticated()){
        res.redirect('/')
    }else {
        res.render('profile', {layout: 'main'});
    }
});

router.get('/editProfile', function(req, res, next) {
    if(req.isUnauthenticated()){
        res.redirect('/')
    }else {
        res.render('editProfile', {layout: 'main'});
    }
});

router.get('/changePassword', function(req, res, next) {
    if(req.isUnauthenticated()){
        res.redirect('/')
    }else {
        res.render('changePassword', {layout: 'main'});
    }
});

var upload = multer({ dest: __dirname+'/tempUIs/'});
//saving the profile after editing
//router.post('/saveProfile', upload.single('profileImage'), function(req, res, next) {
router.post('/saveProfile', upload.single('file') ,function(req, res, next) {

    //if only image uploaded
    if(req.file){
        console.log(path.extname(req.file.filename));
        console.log("req.file==true");
        var file = appDir+'/../public/images/profilepics/' + req.session.passport.user.nic;
        fs.rename(req.file.path, file, function(err) {
            if (err) {
                console.log(err);
                //res.send(500);
            }else {
                /*res.json({
                    message: 'File uploaded successfully',
                    filename: req.file.filename
                });*/
                console.log('file uploaded');
            }
        });
    }

    //if(attachFile) fileAuthentication (req);

    //req.checkBody('firstName','First Name field Empty').notEmpty();
    //req.checkBody('lastName','Last Name field Empty').notEmpty();
    req.check('unic', 'nic not defined').notEmpty();
    req.check('district', 'select your district').notEmpty();
    req.check('mobile', 'Mobile Number Length Invalid').isLength({min: 10, max: 15});

    var errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        console.log(errors);
        res.render('editProfile', {errors : req.session.errors});
    } else {
        mongo.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var myquery = { nic: req.body.unic }; //where clause
            //var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
            var newvalues = { $set: { mobile: req.body.mobile, district: req.body.district } };
            dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
            if (err){
                console.log(err);
                throw err;
            }
            console.log(res.result);
            //req.session.user.mobile=req.body.mobile;
            db.close();
            console.log("profile updated for "+req.session.passport.user.nic);

            });
          });
        }

        //updating the session info
        console.log(req.session);
        //req.session.user.mobile=req.body.mobile;
        req.session.passport.user.mobile=req.body.mobile;
        req.session.passport.user.district=req.body.district;
        //res.redirect('/profile/');
        res.render('profile', { layout:'main', anymsg:'profile settings changed' });
    }
);

//changing the password. backend code
router.post('/savePassword', function (req, res, next) {
    //compare the hash in DB and current password
    //return true if password correct
    var currentPassword= bcrypt.compareSync(req.body.currentPassword, req.session.passport.user.password);
    console.log("old password match? "+currentPassword);

    //new password hash
    var newPassword = bcrypt.hashSync(req.body.pass1, bcrypt.genSaltSync(5), null);

    var errors = req.validationErrors();
    console.log(errors);

    if(errors){
        req.session.errors = errors;
        res.render('/profile/changePassword/' , {errors : errors});
    }else {
        //var password = sha1(req.body.newPassword); //algo??
        var password = req.session.passport.user.password;

        mongo.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            var myquery = { nic: req.session.passport.user.nic }; //where clause
            //var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
            var newvalues = { $set: { password: newPassword } };
            dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
                if (err){
                    console.log(err);
                    throw err;
                }
                console.log(res.result);
                //req.session.user.mobile=req.body.mobile;
                db.close();
                console.log("password changed for "+req.session.passport.user.nic);

            });
        });
        //res.redirect('/users/updateSession');
    }

    //updating the session info
    console.log(req.session);
    //req.session.user.mobile=req.body.mobile;
    //req.session.passport.user.mobile=req.body.mobile;
    req.session.passport.user.password=newPassword;
    res.render('profile', { layout:'main', anymsg2:'profile settings changed' });
    //res.redirect('/profile/');

});

/*
passport.serializeUser(function(user_detail, done) {
    done(null, user_detail);
});

passport.deserializeUser(function(user_detail, done) {
    done(null, user_detail);
});


function fileAuthentication (req) {
        updateAllDetail = {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobile: req.body.mobile,
                profileImage: '/images/' + req.file.filename
            }
        };
        attachFile = false;

}
*/


module.exports = router;