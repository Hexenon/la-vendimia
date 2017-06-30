/**
 * Created by Ben on 28/06/2017.
 */


module.exports = {
    host: {
        adminRoute: 'app',
        port: 8081,
        crossOrigin: true
    },
    db: {
        mysql: {
            engine: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'testUser',
            password: 'rkaC4RBGC',
            database: 'testUser'
        },
        mongodb: {
            engine: 'mongodb',
            host: 'localhost',
            port: 27017,
            database: 'test',
            username: "testUser",
            password: "5Nk3fjAb381d"
        }
    },
    apps:[
        {
            name: "App Web",
            _id: '5938944d84c88f1be8064841'
        },{
            name: "App Android",
            _id: '5938944d84c88f1be8064842'
        },{
            name: "App iOs",
            _id: '5938944d84c88f1be8064843'
        }
    ],
    security:{
        sessionExpiresMinutes: 30
    }
};
