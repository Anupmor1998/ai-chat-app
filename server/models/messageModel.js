const { Schema, default: mongoose } = require("mongoose");

const messageSchema = new Schema(
  {
    content: String,
    status: {
      type: String,
      enum: ["seen", "read"],
      default: "seen",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

module.exports = mongoose.model("Message", messageSchema);
