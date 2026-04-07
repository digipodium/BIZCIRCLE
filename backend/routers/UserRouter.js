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

module.exports = router;