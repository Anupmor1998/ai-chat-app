const { Schema, default: mongoose } = require("mongoose");

const chatSchema = new Schema(
  {
    name: String,
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

module.exports = mongoose.model("Chat", chatSchema);
