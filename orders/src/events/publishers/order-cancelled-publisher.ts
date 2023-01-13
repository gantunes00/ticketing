import {
  OrderCancelledEvent,
  Subjects,
  Publisher,
} from '@gantunestickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
