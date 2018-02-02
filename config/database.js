const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
const options = {
    promiseLibrary: require('bluebird')
};

mongoose.connect(uri,options,(error) => {
    if(error) console.error('DB: connection error: ' + error);
    console.log('DB: OK');
});