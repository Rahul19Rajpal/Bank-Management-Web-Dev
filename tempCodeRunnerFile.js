app.post('/user-details', async (req, res) => {
  try {
      const pin = req.body.pin;
      // Find the user in the database by PIN
      console.log(pin);
      const existingUser = await BankAccount.findOne({ pin });
      console.log(existingUser);
      if (existingUser) {
          // If user found, return user details
          return res.json({
            fullName: existingUser.fullName,
            email: existingUser.email,
            phone: existingUser.phone,
            dob: existingUser.dob,
            gender: existingUser.gender,
            aadhaar: existingUser.aadhaar,
            balance: existingUser.Balance,
            accountNumber: existingUser.accountNumber
          });
      } else {
          // If user not found, return error
          return res.status(404).json({ error: 'User not found or invalid PIN' });
      }
  } catch (error) {
      console.error('Error retrieving user details:', error);
      return res.status(500).json({ error: 'Error retrieving user details' });
  }
});