import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@gantunestickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
