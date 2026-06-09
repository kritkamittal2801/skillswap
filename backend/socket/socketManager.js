let io;

const onlineUsers = {};

export const setIo = (socketIo) => {
  io = socketIo;
};

export const getIo = () => {
  return io;
};

export const getOnlineUsers = () => {
  return onlineUsers;
};

export const emitNotification = (
  userId,
  notification
) => {

    

  const socketId =
    onlineUsers[userId];

    

  if (socketId && io) {
    io.to(socketId).emit(
      "newNotification",
      notification
    );
  }
};