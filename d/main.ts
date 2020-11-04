import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
  const { coupon, statusCoupon } = req.body;

  const textCoupon = `Este cupom ${coupon} está ${statusCoupon}`

  return res.json({ textCoupon });
});

app.listen(3336);
