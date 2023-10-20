const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');


const accessChat = asyncHandler(async (req, res, next) => {
    const { userId } = req.body;
    console.log(req.user)
    if (!userId) {
        res.status(400);
        return console.log('User id param not sent with request')
    }

    var isChat = await Chat.find({
        isGroupMessage: false,
        $and: [
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: req.user._id } } }
        ]
    }).populate("users", "-password")
        .populate("lastMessage")

    isChat = await User.populate(isChat, {
        path: "lastMessage.sender",
        select: "name mailId profilePic"
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroupMessage: false,
            users: [userId, req.user._id]
        }
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200);
            res.send(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }

    }
})

const fetchChats = asyncHandler(async (req, res, next) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("lastMessage")
            .populate("isGroupAdmin")
            .sort({ "updateAt": -1 })
            .then(async (result) => {
                result = await User.populate(result, {
                    path: "lastMessage.sender",
                    select: "name profilePic mailId"
                })
                return res.status(200).send(result);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message)

    }


})

const createGroupChat = asyncHandler(async (req, res, next) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send("Please fill all the fields");
    }
    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group");
    }
    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupMessage: true,
            isGroupAdmin: req.user
        });

        const fullGroup = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("isGroupAdmin", "-password");
        res.status(200).send(fullGroup)

    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }

})

const renameGroup = asyncHandler(async (req, res) => {
    const { chatName, chatId } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        }, {
            new: true
        })
        .populate("users", "-password")
        .populate("isGroupAdmin", "-password");
    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found")
    } else {
        res.status(200).send(updatedChat)
    }

})

const addUserToGroup = asyncHandler(async (req, res) => {
    const { userId, chatId } = req.body;
    const addedUser = await Chat.findByIdAndUpdate(chatId, {
        $push: { users: userId }
    }, { new: true })
        .populate("users", "-password")
        .populate("isGroupAdmin", "-password")
    if (addedUser) {
        res.status(200).send(addedUser)
    } else {
        res.status(404);
        throw new Error("chat not found")
    }
})

const removeUserFromGroup = asyncHandler(async (req, res) => {
    const { userId, chatId } = req.body;
    const removedUser = await Chat.findByIdAndUpdate(chatId, {
        $pull: { users: userId }
    }, { new: true })
        .populate("users", "-password")
        .populate("isGroupAdmin", "-password")
    if (removedUser) {
        res.status(200).send(removedUser)
    } else {
        res.status(404);
        throw new Error("chat not found")
    }

})

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addUserToGroup, removeUserFromGroup }