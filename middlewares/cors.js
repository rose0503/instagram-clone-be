const cors = require("cors");
// const {env} = require('../../config/globals')
let whitelist = [
    'https://instagram-clone-fe.web.app', 
    'https://instagram-clone-fe.firebaseapp.com']
if(process.env.NODE_ENV === 'development') {
    whitelist.push('http://localhost:5000')
}

var corsOptions = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }

// const corsOptions = {
//     origin: function (origin, callback) {
//       if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true)
//       } else {
//         callback(new Error('Not allowed by CORS'))
//       }
//     }
//   }
const middleware = cors(corsOptions)
module.exports = middleware