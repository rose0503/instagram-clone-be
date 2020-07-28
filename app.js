const express = require('express')
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./config/keys')

mongoose.connect(MONGOURI, 
        {   useNewUrlParser: true,
            useUnifiedTopology: true
        })
         .then(_ => console.log("MongoDB connected"))
         .catch(err => console.log("MongoDB can't connect", err));;


//set
app.use(express.json());

//route
const authRoute = require('./routes/auth.route');
const postRoute = require('./routes/post.route');
const userRoute = require('./routes/user.route');
const Post = require('./models/post.model');


app.use(authRoute);
app.use(postRoute);
app.use(userRoute);
 
app.get('/', (req, res) => res.send('Wellcom Instagram backend!'))

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))