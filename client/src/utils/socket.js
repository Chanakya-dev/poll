import { io } from "socket.io-client";

// Connect to the backend server (make sure the URL matches your server's URL)
const socket = io("http://localhost:5000");  // Or the deployed URL of your server

export default socket;
