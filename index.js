const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/loginRoute');

const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
});

app.use(process.env.REGISTER_API, registerRoute);
app.use(process.env.REGISTER_API, loginRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
