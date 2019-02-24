const { itemChangedEvent, orderStateChangeEvent } = require('./helper/eventEmitter')
const redis = require('./helper/redis');

module.exports = (io) => {
    io.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('subscribe', function (data) {
            console.log("Subscribe to " + data);
            socket.join(data);
        });
        socket.on('subscribe_share', function (data) {
            console.log("Subscribe to " + data.userId + ":" + data.orderId);
            socket.join(data.userId + ":" + data.orderId);
            socket.join(data.orderId);

        });
        socket.on('unsubscribe', function(data) {
            socket.leave(data)
        })

    });

    itemChangedEvent.on('changed', async function(data) {
        console.log("Sending Out Event: " + JSON.stringify(data));

        io.to(data.orderId).emit('changed', {
            quantity: await redis.getDetailOfItemInOrder(data.orderId, data.itemId),
            ...data
        });
        io.to(data.userId + ":" + data.orderId).emit('changed_item', {
            quantity: await redis.getDetailOfUserItemInOrder(data.orderId, data.userId, data.itemId),
            ...data
        });
    });

    orderStateChangeEvent.on('changed', function(data) {
       console.log('order Completed: ' + JSON.stringify(data));
       io.to(data.orderId).emit('order_completed', data);
    });
};