import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from "./config/db.js"
import book_route from "./routers/book_route.js"


const app = express();

app.use(
    cors({
        origin:"http://localhost:5173",
        methods:["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]        
    })
);
app.use(express.json())

connectDB();

app.use("/api/book", book_route);

app.listen(5001, () => console.log("app is live on port 5001"),
console.log("http://localhost:5001/api/book/"));