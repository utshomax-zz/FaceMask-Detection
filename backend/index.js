let express = require('express')
//import mongoose
let mongoose = require('mongoose');
var cors = require('cors')
let app = express();

//Import routes
let apiRoutes = require("./routes")
//cores
app.use(cors())
//configure bodyparser to hande the post requests
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


//connect to mongoose
const dbURL = process.env.DBURL || 'mongodb://localhost:27017/dtcmask';
const options = {useNewUrlParser: true, useUnifiedTopology: true}
const mongo = mongoose.connect(dbURL, options);

mongo.then(() => {
    console.log('connected');
}, error => {
    console.log(error, 'error');
});
var db=mongoose.connection;

//Check DB Connection
if (!db)
    console.log("Error connecting db");
else
    console.log("DB Connected Successfully");

// Server Port
var port = process.env.PORT || 3000;

// Welcome message
app.get('/', (req, res) => res.send('Welcome to FaceMask_Detection!'));

//Use API routes in the App
app.use('/api', apiRoutes)

// Launch app to the specified port
app.listen(port, function() {
    console.log("Running api on Port "+ port);
});