const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 3002;

// Connect to MongoDB
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
  },
  pin: {
    type: Number,
    required: true
  },
  Balance: {
    type: Number,
    required: true,
    default: 0
  }
});

// Create model for bank account
const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// Serve Bank_dashboard.html on root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Bank_dashboard.html');
});

// Route to handle adding money
// Route to handle adding money
app.post('/add_money', async (req, res) => {
  try {
    const pin = req.body.pin;
    const amount = req.body.amount;

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).send('Invalid amount');
    }

    // Find the user in the database by Pin
    const existingUser = await BankAccount.findOne({ pin });

    if (!existingUser) {
      return res.status(404).send('Pin Incorrect');
    }
    else {
      // Update balance
      existingUser.Balance += amount;
      await existingUser.save();

      // Send success message along with the new balance
      res.send({
        message: 'Money added successfully',
        balance: existingUser.Balance
      });
    }
  } catch (error) {
    console.error('Error adding money:', error);
    res.status(500).send('Error adding money');
  }
});

// Route to handle withdrawing money
app.post('/withdraw-money', async (req, res) => {
  try {
    const pin = req.body.pin;
    const amount = req.body.amount;
    console.log(pin);
    console.log(amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).send('Invalid amount');
    }

    // Find the user in the database by Pin
    const existingUser = await BankAccount.findOne({ pin });

    if (existingUser) {
      if (existingUser.Balance < amount) {
        return res.status(400).send({ message: 'Insufficient balance' });
      } else {
        // Update balance
        existingUser.Balance -= amount;
        await existingUser.save();

        // Send success message along with the new balance
        return res.send({
          message: 'Money withdrawn successfully',
          balance: existingUser.Balance
        });
      }
    } else {
      return res.status(404).send('Pin Incorrect');
    }
  } catch (error) {
    console.error('Error withdrawing money:', error);
    return res.status(500).send('Error withdrawing money');
  }
});


// Route to handle viewing user details
// Route to handle viewing user details
// Route to handle viewing user details
app.get('/view-details', async (req, res) => {
  try {
    const pin = req.query.pin;
    console.log(pin);
    // Find the user in the database by PIN
    const existingUser = await BankAccount.findOne({ pin });

    // If user not found, return error
    if (!existingUser) {
      console.log('User not found 6');
      return res.status(404).send('User not found 5');
    }

    // Respond with the user's details
    console.log('User details:', existingUser);
    res.send(existingUser);

  } catch (error) {
    console.error('Error retrieving user details:', error);
    res.status(500).send('Error retrieving user details');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
