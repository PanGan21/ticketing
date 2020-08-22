import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
  BadRequestError,
} from "@pgtickets/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    // Find the order that the user is trying to pay for
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    // Make sure that the order belongs to the user
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Make sure the order is not yet cancelled
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }

    // // Create charge record to record successfull payments
    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    // Save the payment to the database
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    // Publish a payment created event
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
