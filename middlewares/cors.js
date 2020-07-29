const cors = require("cors");
// const {env} = require('../../config/globals')
let whitelist = [
    'https://instagram-clone-fe.web.app', 
    'https://instagram-clone-fe.firebaseapp.com']
if(process.env.NODE_ENV === 'development') {
    whitelist.push('http://localhost:5000')
}
const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
const middleware = cors(corsOptions)
module.exports = middleware