import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@gantunestickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
