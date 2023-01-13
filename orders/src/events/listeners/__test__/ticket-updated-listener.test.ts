import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedEvent } from '@gantunestickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  //create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  //create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  //create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: 'ckemnwfkwe',
  };

  //create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, ticket, msg };
};

it('updates a ticket', async () => {
  const { listener, data, ticket, msg } = await setup();
  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  //write assertion to make sure a ticket was updated
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { data, listener, msg } = await setup();

  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  //write assertion to make sure the ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not ack the message as event has skipped version number', async () => {
  const { data, listener, msg } = await setup();

  data.version = 10;
  //call the onMessage function with the data object + message object
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}
  //write assertion to make sure the ack function is called
  expect(msg.ack).not.toHaveBeenCalled();
});

// it('', async () => {

// });
