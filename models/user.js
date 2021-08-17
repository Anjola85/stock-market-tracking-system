const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt-nodejs");

const schema = new mongoose.Schema(
  {
    // firstname: {
    //     type: String,
    //     trim: true,
    //     maxLength: 50
    // },
    // lastname: {
    //     type: String,
    //     trim: true,
    //     maxLength: 50
    // },
    email: {
      type: String,
      maxLength: 62,
      unique: true,
      lowercase: true,
      required: [true, "Email address required"],
      validate: [isEmail, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      unique: true,
      // validate: {//validate with express
      //   validator: function (v) {
      //     return /\d{3}-\d{3}-\d{4}/.test(v);
      //   },
      //   message: (props) => `${props.value} is not a valid phone number!`,
      // },
      required: [true, "User phone number required"],
    },
    // streetAddress: {
    //   type: String,
    //   maxLength: 95,
    // },
    // city: {
    //   type: String,
    //   maxLength: 35,
    // },
    password: {
      type: String,
      trim: true,
      required: [true, "Please enter a passwor"],
      min: [6, "Password too short, minimum length is 5"],
      select: true,
    },
    // SSN: {
    //     type: Number,
    //     trim: true,
    //     unique: true,
    //     validate: {
    //       validator: function(v) {
    //         return /^\d{9}$/.test(v);
    //       },
    //       message: (props) => `Number must be exactly 9`
    //      },
    // }
  },
  { timeStamps: true }
);

schema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  user.password = bcrypt.hashSync(user.password);
  next();
});

schema.methods.comparePassword = function (userPassword) {
  console.log("userpassword: ", this.password);
  return bcrypt.compareSync(userPassword, this.password);
};
module.exports = mongoose.model("User", schema);
