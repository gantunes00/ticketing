import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from '@gantunestickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    //reach into the tickets collection and find thre ticket
    const ticket = await Ticket.findById(data.ticket.id);
    //if no ticket throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    //mark the ticket as reserved by setting its orderId property
    ticket.set({ orderId: undefined });
    //save the ticket
    await ticket.save();
    //publish event due to updated ticket
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
      title: ticket.title,
    });
    //ack the message
    msg.ack();
  }
}
