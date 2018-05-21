/**
 * profile related controls
 * 
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

/*const multer = require('multer');

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'public/images/');
    },
    filename : function (req,file,cb) {
        cb(null,file.fieldname + '-' + Date.now() + '.jpg');
    attachFile = true;
    }

});

attachFile = false;
updateAllDetail = false;

const upload = multer({storage : storage});*/

var expressValidator = require('express-validator');
var passport= require('passport');


var mongo = require('mongodb').MongoClient;
var assert = require('assert');
//var sha1 = require('sha1');

var url = 'mongodb://localhost:27017';
const dbName= 'sahana';

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

//saving the profile after editing
//router.post('/saveProfile', upload.single('profileImage'), function(req, res, next) {
router.post('/saveProfile', function(req, res, next) {

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
        res.render('editProfile', {errors : req.session.errors, layout:'main'});
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
    //encryption algo eka hoya ganna bari una. eken encrypt karanna oni
    //var currentPassword = encryptPassword(req.body.currentPassword); //get old pass hash. algo??

    //compare the hash in DB and current password
    //return true if password correct
    var currentPassword= bcrypt.compareSync(req.body.currentPassword, req.session.passport.user.password);
    console.log("old password match? "+currentPassword);

    //new password hash
    var newPassword = bcrypt.hashSync(req.body.pass1, bcrypt.genSaltSync(5), null);
    //};

//    var newPassword = (req.body.pass1); //get new pass hash. algo??
//    req.check('currentPassword','Current Password Not Correct').equals(req.user.password);
    //req.check('newPassword','Password At least should be 4 characters').isLength({min: 4});
    //req.check('newPassword',' Not matching with Confirm New Password field').equals(req.body.confirmPassword);

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
router.get('/updateUser', function (req, res, next) {

    mongo.connect(url, function(err, client) {
        assert.equal(null, err);
        var dbo = client.db(dbName);
        if(updateAllDetail){
            dbo.collection("user").updateMany(
                {  email: req.user.email},updateAllDetail
                , function(err, rest) {
                    assert.equal(null, err);
                    console.log(rest.result.nModified + " document(s) updated");
                    client.close();
                    updateAllDetail = false;
                    res.redirect('/users/updateSession');
                });
        } else if (updateDetail){
            dbo.collection("user").updateMany(
                {  email: req.user.email},updateDetail
                , function(err, rest) {
                    assert.equal(null, err);
                    console.log(rest.result.nModified + " document(s) updated");
                    client.close();
                    res.redirect('/users/updateSession');
                });
        }

    });



});


router.get('/updatePassword', function (req, res, next) {
    if(req.isUnauthenticated()){
        res.redirect('/')
    }else {
        res.render('updatePassword', {layout: 'user'});
    }

});
*/

/*
router.get('/updateSession', function (req, res, next) {
    console.log(nic);
    mongo.connect(url, function (err,client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.collection('users').find(
            {nic: nic}
        ).toArray(function (err, result) {
            assert.equal(null, err);
                const user__Detail = result[0];
                console.log(user__Detail);
                console.log("User Entered details Correct");
                req.login(user__Detail, function (err) {
                    res.redirect('/profile/');
                });
            client.close();
        });
    });
});
*/

/*
router.post('/changePassword', function (req, res, next) {
    var currentPassword = sha1(req.body.currentPassword);
    req.body.currentPassword = currentPassword;
    req.check('currentPassword','Current Password Not Correct').equals(req.user.password);
    req.check('newPassword','Password At least should be 4 characters').isLength({min: 4});
    req.check('newPassword',' Not matching with Confirm New Password field').equals(req.body.confirmPassword);

    var errors = req.validationErrors();

    if(errors){
        req.session.errors = errors;
        res.render('updatePassword' , {errors : errors});
    }else {
        var password = sha1(req.body.newPassword);
        mongo.connect(url, function(err, client) {
            assert.equal(null, err);
            var dbo = client.db(dbName);
            dbo.collection("user").updateMany(
                {  email: req.user.email},
                { $set: {
                    password : password
                } }, function(err, rest) {
                    assert.equal(null, err);
                    console.log(rest.result.nModified + " document(s) updated");
                    client.close();
                });
        });

        res.redirect('/users/updateSession');

    }

});

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
/*
router.get('/viewProfile', function(req, res, next) {
    res.render('viewProfile', {layout: 'main'});


});
*/


module.exports = router;