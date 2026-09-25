import express from 'express'
import path from 'path'
import router from './router';

// 1 - Kirish
const app = express();
// console.log("dirname", __dirname)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 2 - Sessions

// 3- Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 4 - Routers
app.use("/", router);  // Middlewares: Design Patter 

export default app;

