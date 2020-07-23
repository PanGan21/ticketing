import request from "supertest";
import { Ticket } from "../../models/ticket";
import { app } from "../../app";
import { OrderStatus } from "@pgtickets/common";

it("marks an order as cancelled", async () => {
  // Create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();
  // Make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to cancel an order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // Expectation to make sure the thing is cancelled
  const { body: updatedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
});

it.todo("emits an order cancelled event");
