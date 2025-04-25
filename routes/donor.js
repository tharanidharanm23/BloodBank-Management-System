const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');
const bcrypt = require('bcryptjs');


// Register a new donor
router.post('/register', async (req, res) => {
  try {
    const newDonor = new Donor(req.body);
    await newDonor.save();
    res.redirect('/'); // or res.status(200).json({ message: "Success" });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate email error
      res.status(400).send('Email already exists. Please use a different email.');
    } else {
      console.error('Registration error:', err);
      res.status(500).send('Something went wrong.');
    }
  }
});

// Donor login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(400).send('❌ Donor not found');
    }

    console.log("Entered password:", password); // Debug
    console.log("Stored hashed password:", donor.password); // Debug

    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch) {
      return res.status(400).send('❌ Incorrect password.');
    }

    res.send('✅ Login successful!');
  } catch (err) {
    res.status(500).send('❌ Error: ' + err.message);
  }
});

router.get('/all', async (req, res) => {
  const donors = await Donor.find({});
  res.json(donors);
});


// Find donors by blood group and district
router.get('/find', async (req, res) => {
  let bloodGroup = req.query.bloodGroup?.trim();
  let district = req.query.district?.trim();

  console.log("Searching (trimmed):", bloodGroup, district);

  try {
    const donors = await Donor.find({
      bloodGroup,
      district
    });
    res.json(donors);
  } catch (err) {
    console.error('Error searching donors:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;
