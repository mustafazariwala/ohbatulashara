const express = require('express');
const Subscriber = require('../model/subscriber')
const router = express.Router()
const webpush = require('web-push');

const nodemailer = require("nodemailer");


const vapidKeys = { 
    "publicKey":"BCqnN6SdzSe8Zgi0LAJWLZNRYWrmxcAdJeBC_y9hBphIWeuGDpsQXNcET80ZG-E3Dx_f9zbl44F_HeqWuXXqPD4", 
    "privateKey":"7xi6T3YTjboObArGf3LZbvmUpc4RUGCCEjvSGZh26f8"
};

router.post('/savePush', (req,res,next) => {
    const subscriptionModel = new Subscriber(req.body);
    subscriptionModel.save((err, subscription) => {
        if (err) {
            console.error(`Error occurred while saving subscription. Err: ${err}`);
            res.status(500).json({
                error: 'Technical error occurred'
            });
        } else {
            res.status(200).json({
                data: 'Subscription saved.'
            });
        }
    });
})

router.get('/sendNotification', (req,res,next)=> {
    webpush.setVapidDetails(
        'mailto:mustafazariwala5253@gmail.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );
    
    const notificationPayload = {
        "notification": {
            "title": "YA HUSSAIN 1000 Times | 12 Days Left (OHBATULASHARA)",
            "body": "ذكر الحسين خير زاد الذاكرين",
            "icon": "assets/icons/icon-72x72.png",
            "vibrate": [100, 50, 100],
            "data": {
                "url": "https://ohbatulashara.com/"
                // "dateOfArrival": Date.now(),
                // "primaryKey": 1
            },
            "actions": [{
                "action": "open_url",
                "title": "Tasbeeh Counter"
            }]
        }
    };
    Subscriber.find({}).then(result => {
        // res.send(result)
        Promise.all(result.map(sub => webpush.sendNotification(
            sub, JSON.stringify(notificationPayload) )))
            .then(() => {
                res.status(200).send({message: "Msg Sent Succesfully"})
            })
            .catch(err => {
                res.status(500).send({message: "Msg Failed", err: err})
            });
        
    })
})

router.get('/sendEmail', (req,res,next)=> {
    
// async..await is not allowed in global scope, must use a wrapper
async function main() {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "ohbatulashara.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'admin@ohbatulashara.com', // generated ethereal user
        pass: 'fatema52', // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Ohbatul Ashara" <admin@ohbatulashara.com>', // sender address
      to: "mustafazariwala5253@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "img", // html body
    });
  
    res.status(200).send(info.messageId)
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
  }
  
  main().catch(console.error);
})



module.exports = router
