import app from "./app.js";
import connectDb from "./config/db.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on http://localhost:${PORT}`);
});
