import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@gantunestickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
