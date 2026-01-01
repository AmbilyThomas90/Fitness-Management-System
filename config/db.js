import mongoose from "mongoose";


export const connectDB = async () => {
  try {
      // Attempt to connect using the connection string stored in environment variables
  await mongoose.connect(process.env.MONGO_URI);
// Log success message if connected
console.log("MongoDB Connected");
}catch (error) {
    console.error("MongoDB Error ❌:", error); // Log any error that occurs during connection

    // Exit the process with failure code
process.exit(1);
}
};


