const { Expo } = require("expo-server-sdk");

const sendPushNotification = async (expoPushToken, message) => {
  const expo = new Expo();
  const messages = [
    {
      to: expoPushToken,
      title: "Codak",
      sound: "default",
      body: message,
    },
  ];

  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error("Error sending push notifications:", error);
    }
  }
};

module.exports = {
  sendPushNotification,
};
