import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
    },

    email: {
      type: String,
    },

    image: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "hotelOwner"],
      default: "user",
    },

    recentSearchCities: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;



/*
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    
    _id: {type: String},
    username: {type: String, required: true},
    email: {type: String, required: true},
    image: {type: String, required: true},
    role: {type: String, enum: ["user","hotelOwner"], default: "user"},
    recentSearchCities: [{type: String, required: true}],

},{timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;
*/