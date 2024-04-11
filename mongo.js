const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const LogInCollection = require("./mongo");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const tempelatePath = path.join(__dirname, '../tempelates');
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

app.set('view engine', 'hbs');
app.set('views', tempelatePath);
app.use(express.static(publicPath));

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/signup', async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            password: req.body.password
        };

        const existingUser = await LogInCollection.findOne({ name: req.body.name });
        if (existingUser) {
            res.send("User already exists");
            return;
        }

        await LogInCollection.create(data);
        res.status(201).render("home", {
            naming: req.body.name
        });
    } catch (error) {
        console.error(error);
        res.send("An error occurred");
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await LogInCollection.findOne({ name: req.body.name });
        if (!user || user.password !== req.body.password) {
            res.send("Incorrect username or password");
            return;
        }
        res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` });
    } catch (error) {
        console.error(error);
        res.send("An error occurred");
    }
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/LoginFormPractice", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongoose connected');
        app.listen(port, () => {
            console.log('Server is running on port', port);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
    });

const logInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const LogInCollection = mongoose.model('LogInCollection', logInSchema);

module.exports = LogInCollection;
