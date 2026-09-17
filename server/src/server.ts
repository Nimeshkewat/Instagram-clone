import app from "./app.js";
import { connectCloudinary } from "./config/cloudinary.js";
import connectDb from "./config/db.js";

const PORT = process.env.PORT || 4000;
connectCloudinary();
connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
