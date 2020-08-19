import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth } from "@pgtickets/common";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  async (req: Request, res: Response) => {
    res.send({ sucess: true });
  }
);

export { router as createChargeRouter };
