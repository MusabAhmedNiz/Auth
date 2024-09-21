import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Database connected successfully!");
    });
    connection.on("error", (err) => {
      console.log(`Connection error ${err}`);
      process.exit()
    });
  } catch (error) {
    console.log("Couldn't connect to Database");
    console.log(error);
  }
}
