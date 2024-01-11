const express = require("express");
const dotenv = require("dotenv").config();
const routes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes")
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbconnection")
const port = process.env.PORT || 5001;

connectDB();

const app = express();

app.use(express.json()); // used to parse json data sent in request body
app.use('/api/contacts', routes); // routing urls
app.use('/api/users', userRoutes); // routing urls
app.use(errorHandler); // for error handling

app.listen(port, () => {
    console.log("server running on port " + port);
});