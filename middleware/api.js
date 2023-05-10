import axios from "axios";

const api = axios.create({
  baseURL: "https://3127-193-1-57-1.ngrok-free.app",
});

export const createPost = async ({ userId, image, caption }) => {
  const response = await api.post("/createpost", { userId, image, caption });
  return response.data;
};

export const getPosts = async () => {
  const response = await api.get("/posts");
  return response.data.posts;
};

export const getFriendRequests = async () => {
  const response = await api.get("/friend_requests");
  return response.data.friendRequests;
};


export const sendFriendRequest = async (recipientId) => {
  const response = await api.post("/friend_requests", { recipientId });
  return response.data;
};

export const updateFriendRequest = async (requestId, status) => {
  const response = await api.put(`/friend_requests/${requestId}`, { status });
  return response.data;
};

export const searchUsers = async (term) => {
  const response = await api.get("/search", { params: { term } });
  return response.data.users;
};

export const getFriends = async () => {
  const response = await api.get("/friends");
  return response.data.friends;
};

export const getUser = async () => {
  try {
    const response = await api.get("/user");
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updatePassword = async (userId, { currentPassword, newPassword }) => {
  try {
    const response = await api.put(`/user/password`, { userId, currentPassword, newPassword });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};



export const signUp = async (
  email,
  password,
  expoPushToken,
  firstName,
  lastName,
  profilePicture
) => {
  const response = await api.post("/signup", {
    email: email.trim(),
    pass: password.trim(),
    expoPushToken,
    firstName,
    lastName,
    profilePicture,
  });
  console.log("signIn request data:", { email, password });
  console.log("signIn response data:", response.data);
  return response.data;
};

export const signIn = async (email, password) => {
  const response = await api.post("/signin", { email, password });
  if (response.data.success) {
    return { success: true, data: { userId: response.data.userId } };
  } else {
    return { success: false, message: response.data.message };
  }
};

export const signOut = async () => {
  try {
    const response = await api.post('/signout');
    if (response.data.success) {
    } else {
      console.error('Logout failed:', response.data.message);
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

