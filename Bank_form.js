// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rrbank', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define a Mongoose schema for the bank account
const bankAccountSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  aadhaar: {
    type: Number,
    required: true
  },
  Balance: {
    type: Number,
    required: true
  },
  pin: {
    type: Number,
    required: true,
    unique: true
  },
  accountNumber: {
    type: Number,
    required: true,
    unique: true
  }
});

// Create a Mongoose model based on the schema
const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Define route to serve HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Bank_form.html');
});

// Handle form submission
app.post('/register', async (req, res) => {
  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Generate account number
    const accountNumber = await generateAccountNumber();

    // Create a new bank account document using the form data
    const newBankAccount = new BankAccount({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      dob: req.body.dob,
      password: hashedPassword, 
      gender: req.body.gender,
      aadhaar: req.body.aadhaar,
      Balance: req.body.Balance,
      pin: req.body.pin,
      accountNumber: accountNumber
    });

    // Save the new bank account document to the database
    await newBankAccount.save();
    console.log('Data inserted successfully');
    res.send(`Data inserted successfully. Your account number is: ${accountNumber}`); // Send success message with account number
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data');
  }
});

// Function to generate unique account number
async function generateAccountNumber() {
  let accountNumber;
  let isUnique = false;
  while (!isUnique) {
    // Generate a random 6-digit number
    accountNumber = Math.floor(100000 + Math.random() * 900000);
    // Check if the generated account number is unique in the database
    const existingAccount = await BankAccount.findOne({ accountNumber: accountNumber });
    if (!existingAccount) {
      isUnique = true;
    }
  }
  return accountNumber;
}

// Start server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
