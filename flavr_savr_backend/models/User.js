const mongoose = require("mongoose");
require("mongoose-type-email");

// schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    accessLevel: {
      type: Number,
      required: true,
      default: 1,
    },
    firstTimeUser: {
      type: Boolean,
      default: true,
    },
    diet: {
      type: [String],
      default: [],
    },
    dietOther: {
      type: String,
      default: "",
    },
    avoid: {
      type: [String],
      default: [],
    },
    avoidOther: {
      type: String,
      default: "",
    },

    savedRecipes: {
      type: [
        {
          title: String,
          content: String, // JSON stringified recipe object
          savedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// model
const userModel = mongoose.model("User", userSchema);

// export
module.exports = userModel;
