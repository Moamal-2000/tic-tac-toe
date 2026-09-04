import { IS_PRODUCTION, SOCKET_SERVER_URL } from "@/constants/env";
import { io } from "socket.io-client";

const socketServer = IS_PRODUCTION
  ? SOCKET_SERVER_URL
  : "http://localhost:5000";

export const socket = io.connect(socketServer);
