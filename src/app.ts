import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./libs/config";

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

// 1 - Kirish
const app = express();
// console.log("dirname", __dirname)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(MORGAN_FORMAT));

// 2 - Sessions
app.use(
  session({
    secret: String(process.env.SESSION_SECRET), // Session qurishda ishlatiladigan loyiha kodi
    cookie: {
      //doli //soat  //3
      maxAge: 1000 * 3600 * 6, // session 6 soat davomida aktiv bo'ladi-
    },
    store: store, // mongodb session collectionni ekanligni sozlayapti
    resave: true, // true da - session tugash vaqti yangilanadi. qachon kirilsa shunda boshlab hisoblanadi
    saveUninitialized: true,
  }),
);

// 3- Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 4 - Routers
app.use("/admin", routerAdmin); // SSR: EJS
app.use("/", router); // SPA: React

export default app;
