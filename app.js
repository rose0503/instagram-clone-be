const express = require('express')
const app = express();
const mongoose = require('mongoose');
const port = 5000
const {MONGOURI} = require('./keys')

//ld7W60a0MHKERxrP
mongoose.connect(MONGOURI, 
        {   useNewUrlParser: true,
            useUnifiedTopology: true
        })
         .then(_ => console.log("MongoDB connected"))
         .catch(err => console.log("MongoDB can't connect", err));;
// mongoose.connection.on('connection', () => {
//     console.log('year  success ')
// })
// mongoose.connection.on('err', (err) => {
//     console.log('year  err', err)
// })

//set
app.use(express.json());

//route
const authRoute = require('./routes/auth.route');
const postRoute = require('./routes/post.route');


app.use(authRoute);
app.use(postRoute);
 
app.get('/', (req, res) => res.send('Wellcom Instagram backend!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))