import { Ticket } from '../ticket';

it('implements OCC', async () => {
  //create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });
  //save the ticket to DB
  await ticket.save();
  //fetch ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  //make two separate changes to ticket
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  //save the first fetched ticket
  await firstInstance!.save();
  //save the second fetched ticket and expect error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error('Should not reach this point');
});

it('increments version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });
  //save the ticket to DB
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
