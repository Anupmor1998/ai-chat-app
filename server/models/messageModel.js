const { Schema, default: mongoose } = require("mongoose");

const messageSchema = new Schema(
  {
    content: String,
    status: {
      type: String,
      enum: ["sent", "read"],
      default: "sent",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
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

module.exports = mongoose.model("Message", messageSchema);
