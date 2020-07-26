import { Publisher, Subjects, OrderCretedEvent } from "@pgtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCretedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
