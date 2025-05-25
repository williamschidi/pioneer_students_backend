// const dbConnect = require('./connectionDB');
const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

if (!process.env.CONN_STR) {
  console.log("MongoDB connection string (CONN_STR) is missing in .env file");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONN_STR);
    // await mongoose.connect(process.env.LOCAL_CONN);
    console.log("MongoDB connection successful");
  } catch (err) {
    console.log("error occur", err.message);
  }
};

connectDB();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
