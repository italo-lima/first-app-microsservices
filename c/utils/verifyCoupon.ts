import { Coupon } from "../main";

export const verifyCoupon = (code: string, data: Coupon[]) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].Code === code) {
      return "valid";
    }

    return "invalid";
  }
};
