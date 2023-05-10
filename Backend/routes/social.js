const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const isAuthenticated = require("../middleware/Auth");
const Expo = require("expo-server-sdk").Expo;
const { sendPushNotification} = require("../middleware/notifications");
const { User } = require("../models/User");
const { Post } = require("../models/post");
const { FriendRequest } = require("../models/friendRequest");


router.post("/createpost", isAuthenticated, async (req, res) => {
  const { image, caption } = req.body;
  const userId = req.user._id;

  if (!image) {
    res.status(400).send({ success: false, message: "Image is required" });
    return;
  }

  try {
    const post = new Post({ userId: userId, image, caption });
    await post.save();

    // Fetch user's friends
    const user = await User.findById(userId).populate("friends");

    // Send a push notification to each friend with an expoPushToken
    for (const friend of user.friends) {
      if (friend.expoPushToken) {
        await sendPushNotification(
          friend.expoPushToken,
          `${req.user.firstName} ${req.user.lastName} has made a new post!`
        );
      }
    }

    res.send({ success: true, message: "Post created", post });
  } catch (error) {
    console.log("Error saving post:", error);
    res.status(500).send({ success: false, message: "Error creating post" });
  }
});



router.get("/posts", isAuthenticated, async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    // Add the current user's ID to the list of friendIds
    const friendIds = [...user.friends, userId];

    const posts = await Post.find({ userId: { $in: friendIds } }).sort({
      createdAt: -1,
    });

    // Fetch user data for each post
    const userPromises = posts.map(async (post) => {
      const user = await User.findOne(
        { _id: post.userId },
        "firstName lastName userName profilePicture"
      );
      return {
        ...post.toObject(),
        user: user.toObject(),
      };
    });

    const postsWithUser = await Promise.all(userPromises);
    res.send({ success: true, posts: postsWithUser });
  } catch (error) {
    console.log("Error fetching posts:", error);
    res.status(500).send({ success: false, message: "Error fetching posts" });
  }
});

router.get("/friend_requests", isAuthenticated, async (req, res) => {
  const userId = req.user._id;

  try {
    const friendRequests = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("requester", "firstName lastName profilePicture");

    res.send({
      success: true,
      message: "Friend requests fetched",
      friendRequests,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching friend requests",
    });
  }
});

// Route to send a friend request
router.post("/friend_requests", isAuthenticated, async (req, res) => {
  const userId = req.user._id;
  const { recipientId } = req.body;

  if (!recipientId) {
    res
      .status(400)
      .send({ success: false, message: "Recipient ID is required" });
    return;
  }

  try {
    const friendRequest = new FriendRequest({
      requester: userId,
      recipient: recipientId,
      status: "pending",
    });
    await friendRequest.save();

    // Get the recipient user data
    const recipient = await User.findById(recipientId);

    // Send a push notification to the recipient
    if (recipient.expoPushToken) {
      await sendPushNotification(
        recipient.expoPushToken,
        `${req.user.firstName} ${req.user.lastName} added you as a friend`
      );
    }

    res.send({ success: true, message: "Friend request sent", friendRequest });
  } catch (error) {
    console.log("Error sending friend request:", error);
    res
      .status(500)
      .send({ success: false, message: "Error sending friend request" });
  }
});



// Route to update a friend request
router.put("/friend_requests/:id", isAuthenticated, async (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;
  if (!status || !["accepted", "rejected"].includes(status)) {
    res.status(400).send({ success: false, message: "Invalid status" });
    return;
  }
  try {
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      res
        .status(404)
        .send({ success: false, message: "Friend request not found" });
      return;
    }
    if (friendRequest.status !== "pending") {
      res
        .status(400)
        .send({ success: false, message: "Friend request already processed" });
      return;
    }

    friendRequest.status = status;
    await friendRequest.save();
    if (status === "accepted") {
      // Add the accepted friend to both requester and recipient's friends list
      await User.findByIdAndUpdate(friendRequest.requester, {
        $push: { friends: friendRequest.recipient },
      });
      await User.findByIdAndUpdate(friendRequest.recipient, {
        $push: { friends: friendRequest.requester },
      });
    }
    res.send({
      success: true,
      message: `Friend request ${status}`,
      friendRequest,
    });
  } catch (error) {
    console.log("Error updating friend request:", error);
    res
      .status(500)
      .send({ success: false, message: "Error updating friend request" });
  }
});


router.get("/search", isAuthenticated, async (req, res) => {
  const searchTerm = req.query.term;
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
      ],
    }).select("firstName lastName profilePicture");
    res.send({ success: true, users });
  } catch (error) {
    console.log("Error searching users:", error);
    res.status(500).send({ success: false, message: "Error searching users" });
  }
});

router.get("/friends", isAuthenticated, async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate("friends", "firstName lastName profilePicture");
    res.send({ success: true, friends: user.friends });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching friends" });
  }
});


router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ userEmail: email.toLowerCase() }); // convert email to lowercase

  if (!user) {
    res.status(400).json({ success: false, message: "User not found" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(400).json({ success: false, message: "Invalid password" });
    return;
  }

  req.session.userId = user._id;
  req.session.isLoggedIn = true;
  res.json({ success: true, message: "Logged in", userId: user.userId });
});


router.post("/signup", async (req, res, next) => {
  const userEmail = req.body.email.trim();
  const password = req.body.pass.trim();
  const userId = Date.now();
  const expoPushToken = req.body.expoPushToken;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const profilePicture = req.body.profilePicture;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    res.status(400).json({ success: false, message: "Invalid email format" });
    return;
  }

  const newUser = new User({
    userEmail,
    password,
    userId,
    expoPushToken,
    firstName,
    lastName,
    profilePicture,
  });

  try {
    await newUser.save();
    res.send({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log("Error saving user:", error);
    res.send({ success: false, message: "Error creating user" });
  }
});


router.post("/signout", (req, res) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        console.error("Error destroying session:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      } else {
        res.json({ success: true, message: "Logout successful" });
      }
    });
  } else {
    res.status(400).json({ success: false, message: "No active session" });
  }
});



router.get("/user", isAuthenticated, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).select("firstName lastName userEmail profilePicture");
    res.send({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send({ success: false, message: "Error fetching user" });
  }
});


// Update user password
router.put("/user/password", isAuthenticated, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Retrieve the user from the database using the user's _id from isAuthenticated middleware
    const user = await User.findOne({ _id: req.user._id });

    // If user is not found, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current password is valid
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    // If the current password is invalid, return an error
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Hash the new password and update the user's password
    const newHashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = newHashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Add other routes here
module.exports = {
  router,
  routes: router,
};
