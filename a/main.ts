import express from "express";
import exphbs from "express-handlebars";
import { resolve } from "path";
import bodyParser from "body-parser";
import axios from "axios";
import axiosRetry from "axios-retry";

interface Response {
  status: string;
  textCoupon: string;
}

const app = express();

const viewPath = resolve(__dirname, "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

var hbs = exphbs.create({
  extname: ".hbs",
  layoutsDir: viewPath,
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

app.get("/", (req, res) => {
  return res.render("home", { layout: false, status: "" });
});

app.post("/process", async (req, res) => {
  const { coupon, ccNumber } = req.body;

  axiosRetry(axios, {
    retries: 5,
    retryDelay: (retryCount) => {
      return retryCount * 2000;
    },
  });

  try {
    const { data } = await axios.post<Response>("http://localhost:3334", {
      coupon,
      ccNumber,
    });

    return res.render("home", {
      layout: false,
      status: data.status,
      textCoupon: data.textCoupon,
    });
  } catch (e) {
    return res.render("home", {
      layout: false,
      status: "Servidor fora do ar!",
    });
  }
});

app.listen(3333);
