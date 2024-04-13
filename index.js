const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/loginRoute');
const logoutRoute = require('./routes/logoutRoute');

const { graphqlHTTP } = require('express-graphql');

const { schema, schema2, schema3 } = require('./controllers/nurseController');

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
app.use(process.env.REGISTER_API, logoutRoute);


app.use('/graphql', graphqlHTTP({
    schema: schema3,
    graphiql: true
  }));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});