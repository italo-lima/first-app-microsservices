import express from "express";
import cors from "cors";
import { verifyCoupon } from "./utils/verifyCoupon";
import axiosRetry from "axios-retry";
import axios from "axios";

export interface Coupon {
  Code: string;
}

const coupons: Coupon[] = [{ Code: "abc" }];

const app = express();

app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  const { coupon } = req.body;

  const resultVerifyCoupon = verifyCoupon(coupon, coupons);

  axiosRetry(axios, {
    retries: 5,
    retryDelay: (retryCount) => {
      return retryCount * 2000;
    },
  });

  const { data } = await axios.post("http://localhost:3336", {
    coupon,
    statusCoupon: resultVerifyCoupon,
  });

  return res.json({ status: resultVerifyCoupon, textCoupon: data.textCoupon });
});

app.listen(3335);
