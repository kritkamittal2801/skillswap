import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import requestRoutes from "./routes/request.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import http from "http";
import { Server } from "socket.io";
dotenv.config();
import { setIo, getOnlineUsers } from "./socket/socketManager.js";
import notificationRoutes from "./routes/notification.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { User } from "./models/User.js";
import statsRoutes from "./routes/stats.routes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});
setIo(io);

connectDB();


app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/stats",statsRoutes);

app.get("/", (req, res) => {
  res.send("SkillSwap API Running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {});

io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);
  
  const onlineUsers = getOnlineUsers();

  socket.on("registerUser", async (userId) => {
    onlineUsers[userId] = socket.id;

    await User.findByIdAndUpdate(userId, {
      isOnline: true,
    });

    io.emit("onlineUsers", Object.keys(onlineUsers));
  });

  console.log("Socket Disconnected:", socket.id);
  socket.on(
  "disconnect",
  async () => {

    for (
      const userId in onlineUsers
    ) {

      if (
        onlineUsers[userId] ===
        socket.id
      ) {

        delete onlineUsers[userId];

        await User.findByIdAndUpdate(
          userId,
          {
            isOnline: false,
            lastSeen: new Date()
          }
        );

        io.emit(
          "onlineUsers",
          Object.keys(
            onlineUsers
          )
        );

      }

    }

  }
);
});
