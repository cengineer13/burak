import dotenv from 'dotenv'
import mongoose from 'mongoose';

dotenv.config();

mongoose.connect(process.env.MONGO_URL as string, {})
    .then((data) => {
        console.log("MongoDB connected succesfully!");
        const PORT = process.env.PORT ?? 3003;
    })
    .catch((err) => console.log("ERROR on connection Mongo DB ", err));

