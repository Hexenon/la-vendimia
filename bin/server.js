/**
 * Created by Ben on 08/06/2017.
 */

/*
let express = require('express');
let app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
*/

const conf                    = require(`${__dirname}/../config`).development,
    ServiceApplication      = require(`${__dirname}/../service`);

let app = new ServiceApplication(conf);
app.start()
    .then(()=>{
        console.log("Done");
    })
    .catch((err)=> {
        console.log(err);
    });
