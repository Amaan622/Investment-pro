const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true },

    // Referral system
    referralCode: { type: String, unique: true }, // this user's own code
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // direct parent
    referralLevel: { type: Number, default: 0 }, // depth in the tree

    // Balances
    walletBalance: { type: Number, default: 0 },
    totalInvested: { type: Number, default: 0 },
    totalROIEarned: { type: Number, default: 0 },
    totalLevelIncome: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate unique referral code
userSchema.pre("save", function (next) {
  if (!this.referralCode) {
    this.referralCode =
      this._id.toString().slice(-6).toUpperCase() +
      Math.random().toString(36).slice(2, 5).toUpperCase();
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
