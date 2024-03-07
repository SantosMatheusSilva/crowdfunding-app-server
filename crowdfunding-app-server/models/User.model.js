const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    profilePic: {
      type: String,   /* include profile pictures or placeholders  - (user upload his own image)*/
      default: "https://imgur.com/gallery/i9xknax",
    }
   
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt` <<<--- ????
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

