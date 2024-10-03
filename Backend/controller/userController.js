const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const userModel = require("../Models/userModel");
const mongoose = require("mongoose");

dotenv.config();
const uri = process.env.MONGODB_URI;

// Function to handle user signup
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if the user already exists
    let user = await userModel.findOne({ name });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user object
    const newUser = {
      name,
      email,
      password: hashedPassword,
      Repository: [],
      followedUser: [],
      starRepo: [],
    };

    // Save the new user to the database
    const result = await userModel.create(newUser);

    // Generate JWT token
    const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return the token and user ID
    res.json({ token, userId: result._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Function to handle user login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return the token and user ID
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Function to get all users
const getAllUser = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await userModel.find({});
    res.send(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Function to get a user's profile
const getUserProfile = async (req, res) => {
    const { id } = req.params; // Corrected to use req.params.id
    console.log("Received userId:", id); // Optional: Log the received id for debugging
    try {
      // Validate that the id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid userId format" });
      }
  
      // Find the user by ID using the corrected id
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      res.send(user);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  

// Placeholder function to update a user's profile
const UpdateUserProfile = async (req, res) => {
    const { id } = req.params;
    console.log("id:",id)
    const { email, password } = req.body;
  
    try {
      // Create an object to hold fields to be updated
      const updatedFields = { email };
  
      // If password is provided, hash it and add to updated fields
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updatedFields.password = hashedPassword;
      }
  
      // Find the user by ID and update with the new fields
      const result = await userModel.findByIdAndUpdate(
        id,
        { $set: updatedFields },
        { new: true } // Use 'new: true' to return the updated document
      );
  
      // Check if the user was found and updated
      if (!result) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Send the updated user data
      res.send(result);
    } catch (err) {
      // Handle server errors
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  
// Placeholder function to delete a user
const DeleteUser =async (req, res) => {
    const {id}=req.params;
    try{

        const result=await userModel.findByIdAndDelete(id);
        res.json({message:"User Deleted Successfully!"})

} catch (err) {
    // Handle server errors
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  signup,
  login,
  getUserProfile,
  UpdateUserProfile,
  DeleteUser,
  getAllUser,
};
