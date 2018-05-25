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

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'public/images/profilePics/');
    },
    filename : function (req,file,cb) {
        cb(null,file.fieldname + '-' + Date.now() + '.jpg');
        req.session.attacheProfilePic = true;
    }

});

const updateUser = multer({storage : storage});


var fs = require("fs");

var path = require('path');
//var appDir = path.dirname(require.main.filename); //www

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
    req.session.attacheProfilePic = false;
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

//saving the profile after editing
//router.post('/saveProfile', upload.single('profileImage'), function(req, res, next) {
router.post('/saveProfile', updateUser.single('profileImage') ,function(req, res, next) {

    req.check('province', 'Choose the Province Field').notEmpty();
    req.check('district', 'Choose the District Field').notEmpty();
    req.check('firstName', 'Fill the First Name Field').notEmpty();
    req.check('lastName', 'Fill the Last Name Field').notEmpty();
    req.check('gender', 'Choose the Gender Field').notEmpty();
    req.check('role', 'Choose the Role Field').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        res.render('editProfile', {messages : req.session.errors, layout : 'main'});
    } else {

        req.session.mobileLKR = "+94" + (req.body.mobile).slice(1);
        req.session.nicLKR = (req.body.nic) + "v";

        if (req.session.attacheProfilePic) {

            User.findByIdAndUpdate(req.user._id, {
                $set: {
                    nic : req.session.nicLKR,
                    firstName : req.body.firstName,
                    lastName : req.body.lastName,
                    gender : req.body.gender,
                    province : req.body.province,
                    district : req.body.district,
                    role : req.body.role,
                    mobile : req.session.mobileLKR,
                    phone : req.body.phone,
                    profileImage: '/images/profilePics/'+ req.file.filename
                }
            }, {new: true}, function (err, docs) {
                assert.equal(null, err);
                req.session.passport.user.nic = req.session.nicLKR;
                req.session.passport.user.firstName = req.body.firstName;
                req.session.passport.user.lastName = req.body.lastName;
                req.session.passport.user.gender = req.body.gender;
                req.session.passport.user.province = req.body.province;
                req.session.passport.user.district = req.body.district;
                req.session.passport.user.role = req.body.role;
                req.session.passport.user.mobile = req.session.mobileLKR;
                req.session.passport.user.phone = req.body.phone;
                req.session.passport.user.profileImage = '/images/profilePics/'+ req.file.filename;
                res.redirect('/profile/');
            });
        } else {

            User.findByIdAndUpdate(req.user._id, {
                $set: {
                    nic : req.session.nicLKR,
                    firstName : req.body.firstName,
                    lastName : req.body.lastName,
                    gender : req.body.gender,
                    province : req.body.province,
                    district : req.body.district,
                    role : req.body.role,
                    mobile : req.session.mobileLKR,
                    phone : req.body.phone
                }
            }, {new: true}, function (err, docs) {
                assert.equal(null, err);
                req.session.passport.user.nic = req.session.nicLKR;
                req.session.passport.user.firstName = req.body.firstName;
                req.session.passport.user.lastName = req.body.lastName;
                req.session.passport.user.gender = req.body.gender;
                req.session.passport.user.province = req.body.province;
                req.session.passport.user.district = req.body.district;
                req.session.passport.user.role = req.body.role;
                req.session.passport.user.mobile = req.session.mobileLKR;
                req.session.passport.user.phone = req.body.phone;
                res.redirect('/profile/');
            });

        }

    }
});



//changing the password. backend code
            router.post('/savePassword', function (req, res, next) {
                //compare the hash in DB and current password
                //return true if password correct
                var currentPassword = bcrypt.compareSync(req.body.currentPassword, req.session.passport.user.password);
                console.log("old password match? " + currentPassword);

                //new password hash
                var newPassword = bcrypt.hashSync(req.body.pass1, bcrypt.genSaltSync(5), null);

                //var errors = req.validationErrors();
                //console.log(errors);

                if (!currentPassword) { //if entered current password is NOT correct
                    //req.session.errors = errors;
                    res.render('changePassword', {messages: "Current Password Not correct", layout : 'main'});
                } else {
                    //var password = sha1(req.body.newPassword); //algo??
                    //var password = req.session.passport.user.password;

                    mongo.connect(url, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db(dbName);
                        var myquery = {nic: req.session.passport.user.nic}; //where clause
                        var newvalues = {$set: {password: newPassword}};
                        dbo.collection("users").updateOne(myquery, newvalues, function (err, res) {
                            assert.equal(null, err);
                            console.log(res.result);
                            //req.session.user.mobile=req.body.mobile;
                            db.close();

                        });
                        console.log("password changed for " + req.session.passport.user.nic);
                        req.session.passport.user.password = newPassword;
                        res.render('profile', {layout: 'main', anymsg2: 'profile settings changed'});
                    });

                    //updating the session info
                    //res.redirect('/profile/');
                }
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