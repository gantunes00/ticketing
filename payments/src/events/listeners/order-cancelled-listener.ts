import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@gantunestickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    //reach into the tickets collection and find thre ticket
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    //if no ticket throw error
    if (!order) {
      throw new Error('Order not found');
    }
    //mark the ticket as reserved by setting its orderId property
    order.set({ status: OrderStatus.Cancelled });
    //save the ticket
    await order.save();
    //ack the message
    msg.ack();
  }
}
