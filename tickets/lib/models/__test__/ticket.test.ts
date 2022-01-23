import Ticket from '../ticket';
var mongoose = require('mongoose');

it('implement optimistic concurrency control', async () => {
    const ticket = await Ticket.create({
        id: mongoose.Types.ObjectId(),
        title: 'concert',
        price: 30,
        userId: '123'
    })
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    await firstInstance?.set({ price: 50 }).save();
    try {
        await secondInstance?.set({ price: 200 }).save();
    } catch (error) {
        return
    }
    throw new Error("shold now reach this point");
})

it('increments version number of ticket on multiple save', async () => {
    const ticket = await Ticket.create({
        title: 'concert',
        price: 30,
        userId: '123'
    })
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
})