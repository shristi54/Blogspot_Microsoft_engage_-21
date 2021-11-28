const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const UserNotification = new mongoose.Schema({
    title: {
        type: String
    },
    message: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    },
    postid:{
        type: ObjectId,
        ref:"Post"
    },
    sender:{
        type: ObjectId,
        ref:"User"
    },
    reciever:{
        type: ObjectId,
        ref:"User"
    },
    response : {
        type : Boolean,
        default : false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("Notification",UserNotification)