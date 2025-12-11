import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from "./config/db.js"
import book_route from "./routers/book_route.js"
import user_route from "./routers/user_route.js"
import assignment_route from "./routers/assignment_route.js"
import adminAuthRoute from './routers/admin_auth_route.js';
import adminUserRoute from './routers/admin_user_route.js';
import userAuthRoute from './routers/user_auth_route.js';


const app = express();


//Middleware
app.use(
    cors({
        origin: ["http://localhost:5173", "*"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);
app.use(express.json()) //helps to get the data in json format


//Routes
// Public auth endpoints must be registered before protected /api/user routes
app.use('/api', adminAuthRoute);   
app.use('/api', userAuthRoute);

app.use("/api/book", book_route);
app.use("/api/user",user_route);
app.use("/api/assignment", assignment_route);
app.use('/api', adminUserRoute);   

//Database Connection
connectDB();

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`app is live on port ${PORT}`);
    console.log(`http://localhost:${PORT}/api/`);
});