import request from "supertest";
import { Ticket } from "../../models/ticket";
import { app } from "../../app";

const buildTicket = async () => {
  const ticket = Ticket.build({ title: "concert", price: 20 });
  await ticket.save();

  return ticket;
};

it("fetches orders of a particular user", async () => {
  // Create three tickets
  const tickeOne = await buildTicket();
  const tickeTwo = await buildTicket();
  const tickeThree = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();
  // Create one order as User #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: tickeOne.id });

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: tickeTwo.id });

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: tickeThree.id });

  // Make request to get orders for User #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(tickeTwo.id);
  expect(response.body[1].ticket.id).toEqual(tickeThree.id);
});
