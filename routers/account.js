var jwt = require('jsonwebtoken');
let router = require('express').Router();
let Users = require('../models/users');

router.post('/login', (req, res, next) => {
    let { username, password } = req.body;
    let hashPassword = jwt.sign(password, 'secretstring');

    Users.findOne({
        username: username
    }, (err, doc) => {
        if(err || !doc){
            return res.status(401).json({
                message: err                
            })
        }else if(doc.password != hashPassword){
            return res.status(401).json({
                message: 'Invalid password'                
            })
        }else{
            const user = doc.toJSON();
            const token = jwt.sign(user, 'secretstring');
            return res.json({
                user: {
                    username: user.username,
                    userType: user.userType
                },
                token: token
            });
        }
    })
})

router.post('/register', (req, res, next) => {
    let {username, password, email} = req.body; 
    let hashPassword = jwt.sign(password, 'secretstring');

    const user = new Users({
        username: username,
        password: hashPassword,
        email: email
    });

    user.save((err, doc) => {
        if(err){
            res.status(500).json({
                message: 'User Not created',
                err: err
            })
        }else{
            res.status(201).json({
                message: 'user created'
            })
        }
    })
})

module.exports = router;