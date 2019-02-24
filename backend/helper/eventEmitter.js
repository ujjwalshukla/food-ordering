const EventEmitter = require('events');

class ItemChangedEvent extends EventEmitter {}
const itemChangedEvent = new ItemChangedEvent();

class OrderAddedEvent extends EventEmitter {}
const orderAddedEvent = new OrderAddedEvent();

class OrderStateChangeEvent extends EventEmitter {}
const orderStateChangeEvent = new OrderStateChangeEvent();

module.exports = { itemChangedEvent, orderAddedEvent, orderStateChangeEvent };