const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const port = 3001;

mongoose.connect('mongodb://localhost:27017/rrbank')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define schema for bank account
const bankAccountSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Create model for bank account
const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Bank_login.html');
});

app.post('/login', async (req, res) => {
  try {
    const { fullName, password } = req.body;
    
    // Query the BankAccount collection
    const existingUser = await BankAccount.findOne({ fullName });
    if (!existingUser) {
      return res.status(400).send('User not found');
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).send('Incorrect password');
    }
    res.redirect('http://localhost:3002')


  } 
  catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
