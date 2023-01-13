import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@gantunestickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
