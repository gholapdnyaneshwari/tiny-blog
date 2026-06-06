import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import User from "./models/User.js";
import md5 from "md5";

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

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const newUser = new User({
            name,
            email,
            password: md5(password)
        });

        await newUser.save();

        res.json({
            success: true,
            message: "User saved successfully",
            data: newUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email,
            password: md5(password)
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
app.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});