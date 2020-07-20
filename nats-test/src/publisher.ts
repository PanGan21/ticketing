import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  new TicketCreatedPublisher(stan).publish({
    id: "123",
    title: "concert",
    price: 20,
  });

  //   const data = JSON.stringify({
  //     id: "123",
  //     title: "concert",
  //     price: 20,
  //   });

  //   stan.publish("ticket:created", data, () => {
  //     console.log("Event published");
  //   });
});
