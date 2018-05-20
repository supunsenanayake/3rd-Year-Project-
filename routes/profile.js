var express = require('express');
var router = express.Router();
var passport = require('passport');

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
  //res.send('respond with a resource');
  res.render('profile'); //, {layout :'user'} );
});

router.get('/viewProfile', function(req, res, next) {
    if(req.isUnauthenticated()){
        res.redirect('/')
    }else {
        res.render('profile', {layout: 'landing', usr:user});
    }


});

router.get('/editProfile', function(req, res, next) {
    if(req.isUnauthenticated()){
        res.redirect('/')
    }else {
        res.render('editProfile', {layout: 'user'});
    }

});

/*
router.post('/upgradeProfile', upload.single('profileImage'), function(req, res, next) {
    if(attachFile) fileAuthentication (req);
    req.checkBody('firstName','First Name field Empty').notEmpty();
    req.checkBody('lastName','Last Name field Empty').notEmpty();
    req.check('email', 'Invalid Email').isEmail();
    req.check('mobile', 'Mobile Number Length Invalid').isLength({min: 10, max: 15});

    var errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        res.render('editProfile', {errors : req.session.errors});
    } else {
        updateDetail = {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobile: req.body.mobile,
            }
        };
        req.session.errors = false;
        if(req.user.email == req.body.email){
            newEmail = req.user.email;
            res.redirect('/users/updateUser');
        }else{
            newEmail = req.body.email;
            mongo.connect(url, function (err, client) {
                assert.equal(null, err);
                const db = client.db(dbName);
                db.collection('user').find({email: req.body.email}, {email: 1})
                    .toArray(function (err, result) {
                        assert.equal(null, err);
                        if (result.length > 0) {
                            console.log("Check unique Email");
                            res.render('editProfile', {errors : req.session.errors, existNewEmail : true});
                        } else {
                            res.redirect('/users/updateUser');
                        }
                        client.close();
                    });
            });
        }




    }
});


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


router.get('/updateSession', function (req, res, next) {
    console.log(newEmail);
    mongo.connect(url, function (err,client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.collection('user').find(
            {email: newEmail}
        ).toArray(function (err, result) {
            assert.equal(null, err);
                const user__Detail = result[0];
                console.log(user__Detail);
                console.log("User Entered details Correct");
                req.login(user__Detail, function (err) {
                    res.redirect('/users/viewProfile');
                });
            client.close();
        });
    });
});


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