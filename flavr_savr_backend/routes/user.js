const express = require("express");
const router = express.Router();
const Utils = require("../utils/generateTokens");
const User = require("./../models/User");
const path = require("path");

// GET /user/me - must come before /:id to avoid conflict
router.get("/me", Utils.authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // exclude password
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch user" });
  }
});

// GET - get single user -------------------------------------------------------
router.get("/:id", Utils.authenticateToken, (req, res) => {
  if (req.user._id != req.params.id) {
    return res.status(401).json({
      message: "Not authorised",
    });
  }

  User.findById(req.params.id)
    .then((user) => {
      console.log(user);
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Couldn't get user",
        error: err,
      });
    });
});

// PATCH - set preferences for dietary requirements and allergies -------------------------------------------------------
router.patch("/onboarding/:id", Utils.authenticateToken, async (req, res) => {
  if (req.user._id !== req.params.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { diet, dietOther, avoid, avoidOther } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        diet,
        dietOther,
        avoid,
        avoidOther,
        firstTimeUser: false, // mark as no longer first-time
      },
      { new: true } // return the updated document
    );

    updatedUser.password = undefined; // hide password
    res.json({ user: updatedUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update onboarding data", error: err });
  }
});

// POST - save a recipe -------------------------------------------------------
router.post("/save-recipe", Utils.authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add recipe to savedRecipes array
    user.savedRecipes.push({
      title,
      content,
      savedAt: new Date(),
    });

    await user.save();

    res.json({ message: "Recipe saved successfully", savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save recipe", error: err });
  }
});

// GET - get saved recipes -------------------------------------------------------
router.get("/saved-recipes", Utils.authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("savedRecipes");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch saved recipes", error: err });
  }
});

module.exports = router;
