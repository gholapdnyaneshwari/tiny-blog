import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

let requestCount = 0;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,);
        if (conn) {
            console.log("MongoDB connected");
        }
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

app.get("/api/request-count", (req, res) => {
    res.json({ requestCount });
});

app.use((req, res, next) => {
    requestCount++;
    next();
});
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "server is running",
    });
});

const checkHeaderkey = (req, res, next) => {
    const { api_token } = req.headers;
    console.log("Checking API token:", api_token);

};
app.get("/api/test1", (req, res) => {
        console.log("Actual Controller test1 called");
        res.json({ message: "Test1 route reached" });
    }
    )

app.get("/api/test2", (req, res) => {
    console.log("Actual Controller test2 called");
    res.json({ message: "Test2 route reached" });
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});