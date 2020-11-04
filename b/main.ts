import express from "express";
import cors from "cors";
import axios from "axios";
import axiosRetry from "axios-retry";

interface Response {
  status: string;
  textCoupon: string;
}

const app = express();

app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  const { coupon, ccNumber } = req.body;

  axiosRetry(axios, {
    retries: 5,
    retryDelay: (retryCount) => {
      return retryCount * 2000;
    },
  });

  try {
    let status = "declined";

    const { data } = await axios.post<Response>("http://localhost:3335", {
      coupon,
    });

    if (ccNumber === "1") {
      status = "approved";
    }

    if (data.status.toLowerCase() === "invalid") {
      status = "invalid coupon";
    }

    return res.json({ status, textCoupon: data.textCoupon });
  } catch {
    return res.json({ status: "declined" });
  }
});

app.listen(3334);
