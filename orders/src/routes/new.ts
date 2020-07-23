import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@pgtickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("TicketId must be provided")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket that the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    // Means that a ticket is not associated with an order and the order's status is not cancelled
    // Run a query to look at all orders. Find an order where the ticket is the one found and the status is not cancelled
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // Calculate an expiration date for this order

    // Build the order and save it to the database

    // Publish an event saying that an order was created
    res.send({});
  }
);

export { router as newOrderRouter };
