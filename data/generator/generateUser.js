/**
 * Created by Ben on 07/06/2017.
 */


'use strict';

const Conf = require('../../config'),
    mongoose = require('mongoose');

let _conf = null;

if (process.argv.indexOf('--beta') > -1){
    _conf = Conf.beta;
}else if (process.argv.indexOf('--production') > -1){
    _conf = Conf.production;
}else {
    _conf = Conf.development;
}

let options = null;

Object.keys(_conf.db).forEach((c)=>{
    let cc = _conf.db[c];
    if (cc.engine === "mongodb"){
        options = cc;
    }
});

let connection = mongoose.createConnection();
connection.open(`mongodb://${options.username ? options.username + ':' + options.password + '@' : ''}${options.host}:${options.port}/${options.database}?authSource=admin`, {
    uri_decode_auth: true
});

connection.on("open",()=>{
    let usersModel = require(__dirname + '/../src/models/mongodb/users')(connection, mongoose);

    let newUser = new usersModel({
        name: 'Admin',
        lastName: 'Administrator',
        password: 'admin',
        email: 'admin@lavendimia.io'
    });

    newUser.save((err)=>{
        if (!err){
            console.log(`New User ${newUser.name} added with _id ${newUser._id}`);
        }
        process.exit();
    })
});