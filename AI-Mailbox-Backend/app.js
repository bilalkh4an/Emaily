import express from "express";
import emailRoutes from "./routes/emailRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import cors from "cors";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", emailRoutes);
app.use("/api", aiRoutes);
app.use("/api", authRoutes);

//Allow only your frontend domain & uncomment this on backend server

//  app.use(cors({
//    origin: '*', // or '*' to allow all
//    methods: ['GET','POST','PUT','DELETE'],
//    credentials: true // if you need cookies/auth
//   }));

export default app;
