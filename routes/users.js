const express = require('express');
const User = require('../model/user')
const router = express.Router()
const webpush = require('web-push');
const fs = require('fs');
const path = require('path')


router.get("/try", (req,res,next)=> {
    res.send('Hi')
})
router.post("/signup", (req,res,next)=> {
    // let emailVerificationCode = getRandomIntInclusive(100000, 999999)
    console.log('Signup')
    User.findOne({email: req.body.email.toLowerCase()})
    .then(result => {
        console.log(result)
        if (result){
            return res.status(404).json({
                message: 'Duplicate Email id'
            })
        }
        // const hash = bcrypt.hashSync(req.body.password, salt);
        const user = new User({
                fullName: req.body.fullName,
                country: req.body.country,
                email: req.body.email.toLowerCase(),
                password:  req.body.password
            })
        user.save();
        // signupEmail(emailVerificationCode, req.body.email,req.body.firstName,req.body.lastName)
        res.status(200).json({
            message: 'Email Created Successfully',
            userData: {
                email: user.email,
                id: user._id
            }
        })
    })
    .catch(err =>{
        console.log(err)
    })
})

router.post("/login", (req,res,next)=> {
    fetchedUser = null
    let projection = {
        fullName: true,
        password: true,
        email: true,
        country: true
    }
    User.findOne({email: req.body.email}, projection)
    .then(user => {
        fetchedUser = user
        if(!user){
            return res.status(401).json({
                message: "This Email has no been registered. Please register to Login."
            })
        }
        return user
    })
    .then(result => {
        if(result.password !== req.body.password){
            return res.status(401).json({
                message: "Password Incorrect"
            })
        }
        // loginEmail(fetchedUser.email, fetchedUser.firstName, fetchedUser.lastName)
        res.status(200).send({
            fullName: fetchedUser.fullName,
            email: fetchedUser.email,
            id: fetchedUser._id,
            country: fetchedUser.country,
        })
    })
    .catch(err => {
    })
})

router.get("/id/:id", (req,res,next)=> {
    let id = req.params.id
    let projection = {
        fullName: true,
        email: true,
        country: true
    }
    User.findById(id, projection).then(result => {
        res.status(200).send({
            fullName: result.fullName,
            email: result.email,
            id: result._id,
            country: result.country,
        })
        console.log(result)
    })
})

router.post("/saveTasbeeh" ,  (req,res,next)=> {
    let payload = {
        grg: req.body.grg,
        hij: req.body.hij.hij,
        count: req.body.count
    }
    console.log('New',req.body)
    console.log(payload)
    console.log(req.body.id)
    User.findById(req.body.id, {tasbeeh: true}).then(result => {
        // let ifIncludes = 1
        console.log(result)
        if(!result.tasbeeh){
            console.log('Tasbeeh Nulled')
            return
        }
        let ifIncludes = result.tasbeeh.find( ({hij}) => hij === payload.hij)
        if(!ifIncludes){
            console.log('There is no saved Tasbeeh for that date')
            res.status(200).send({message: 'Tasbeeh Updated Successfully'})
            User.findByIdAndUpdate(req.body.id, {$push: {tasbeeh: payload}}).then(result => {
                console.log(result)
            })
            return;
        }
        console.log('There is Tasbeeh for that date')
        User.update({_id: req.body.id, "tasbeeh.hij": payload.hij}, {$inc: {'tasbeeh.$.count' : payload.count}}).then(result => {
            console.log(result)
        })
        res.status(200).send({message: 'Tasbeeh Updated Successfully'})
    })

})
router.get('/getAllTasbeeh/:id', (req,res,next)=> {
    User.findById(req.params.id, {tasbeeh: true}).then(result => {
        res.status(200).send(result.tasbeeh)
    })
})

router.get('/test', (req,res,next)=> {
    var data = {};
    function readFiles(dirname, onFileContent, onError) {
        fs.readdir(dirname, function(err, filenames) {
          if (err) {
            onError(err);
            return;
          }
          filenames.forEach(function(filename) {
            fs.readFile(dirname + filename, 'utf-8', function(err, content) {
              if (err) {
                onError(err);
                return;
              }
              onFileContent(filename, content);
            });
          });
        });
    }
    readFiles('dirname/', function(filename, content) {
    data[filename] = content;
    console.log(data)
    }, function(err) {
    throw err;
    });
})
let media = [{
    marasiyah: {audio: []},
    salaam: {audio: []}
}]


router.get('/media', (req,res,next)=> {
    res.status(200).send(media)
})

// const path = require('path');
    // const fs = require('fs');
    //joining path of directory 
    const marasiyahDirectoryPath = path.join(__dirname, '../files/audio/marasiyah');
    //passsing directoryPath and callback function
    fs.readdir(marasiyahDirectoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            // console.log(file)
            media[0].marasiyah.audio.push(file)
        });
    });

    const salaamDirectoryPath = path.join(__dirname, '../files/audio/salaam');
    
    fs.readdir(salaamDirectoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            // console.log(file)
            media[0].salaam.audio.push(file)
        });
    });
module.exports = router
