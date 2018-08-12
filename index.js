let express = require('express');
let app = express();

let accounts = require('./routers/account');
let secured = require('./routers/secured');
let mongoose = require('mongoose');
let bodyParser = require('body-parser')
let Users = require('./models/users');
let jwt = require('jsonwebtoken');
let cors = require('cors')

app.use(cors())

mongoose.connect('mongodb://neutrinos:neutrinos123@ds117422.mlab.com:17422/neutrinos',
    (err, success) => { if (err) { console.log(err); throw 'mongoerror' } console.log('mongo connected'); createDefaultAgent() });

process.on('uncaughtException', (e) => {
    console.log('CanNot connect to db, killing', e);
    process.exit()
});

createDefaultAgent = () => {
    Users.findOneAndUpdate({
        username: 'agent'
    }, {
            username: 'agent',
            password: jwt.sign('agent', 'secretstring'),
            userType: 'agent',
            email: 'agent@email.com'
        }, { upsert: true }, (err, agent) => {
            console.log('agent default', JSON.stringify(agent));
        })
}

/**
 * Creating a default agent username: agent, password: agent
 */


app.use(bodyParser.json())

/**
 * Secured routes
 */

app.use('/api/secured', secured);

/**
 * Not secured routes
 */
app.use('/api/accounts', accounts);


app.listen(3000, () => { console.log("application started on port 3000"); })