import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  const userSocket = new Map(); // {userId: socketId}
  const userActivities = new Map(); // {userId: activity}

  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      userSocket.set(userId, socket.id);
      userActivities.set(userId, "Idle");

      //broadcast to all connected sockets that this  user just logged in
      io.emit("user_connected", userId);

      socket.emit("users_online", Array.from(userSocket.keys()));

      io.emit("activities", Array.from(userActivities.entries()));
    });

    socket.on("update_activity", ({ userId, activity }) => {
      console.log("activity updated", userId, activity);

      userActivities.set(userId, activity);

      io.emit("activity_updated", { userId, activity });
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        // Send to receiver in realtime , if they are onl
        const receiverSocketId = userSocket.get(receiverId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }

        socket.emit("message_sent", message);
      } catch (error) {
        console.error("Message error:", error);
        socket.emit("message_error", error.message);
      }
    });

    socket.on("disconnect", () => {
      let disconnectUserId;

      for (const [userId, socketId] of userSocket.entries()) {
        //find disconnected user

        if (socketId === socket.id) {
          disconnectUserId === userId;
          userSocket.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }

      if (disconnectUserId) {
        io.emit("user_disconnected", disconnectUserId);
      }
    });
  });
};
