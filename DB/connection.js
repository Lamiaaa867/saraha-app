import mongoose from "mongoose";

export const connectDB=async ()=>{
    return await mongoose
    .connect(process.env.DB_CONNECTION_URL)
    .then((res) => console.log('Db connection success'))
    .catch((err) =>console.log('DB connection Fail', err))
}

