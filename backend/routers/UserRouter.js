const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// GET user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    // Handling invalid ObjectId format errors
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// UPDATE user profile
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, // Returns the modified document rather than the original
        runValidators: true // Ensures the update follows your Model's rules
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    // Usually a 400 because update failures are often validation issues
    res.status(400).json({ error: "Update failed", details: err.message });
  }
});

// EXISTING FETCHES...
const jwt = require('jsonwebtoken');

// A simple login mock that returns a JWT for the first user or creates a login if provided.
// Usually you'd check passwords. We are keeping it simple for testing!
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    // Beginner friendly: If missing, auto-create a mockup user for ease of testing if missing. 
    // In production we'd return 401.
    if (!user) {
        if(!req.body.name) return res.status(400).json({message: "User not found. Provide 'name' to auto-register."});
        user = await User.create({ name: req.body.name, email, password: password || '123456' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'mytopseret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;