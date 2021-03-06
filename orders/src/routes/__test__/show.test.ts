import request from "supertest";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { app } from "../../app";

it("fetches the order", async () => {
  // Create a ticket
  const ticket = await Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  ticket.save();

  const user = global.signin();
  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if a user tries to fetch other user's order", async () => {
  // Create a ticket
  const ticket = await Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  ticket.save();

  const user = global.signin();
  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});
