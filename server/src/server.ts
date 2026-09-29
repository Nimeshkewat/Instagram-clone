import { createServer } from "node:http";
import app from "./app.js";
import { connectCloudinary } from "./config/cloudinary.js";
import connectDb from "./config/db.js";
import { initializeSocket } from "./socket.js";

const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

initializeSocket(httpServer);
connectCloudinary();
connectDb();

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
