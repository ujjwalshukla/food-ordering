const { itemChangedEvent } = require('./helper/eventEmitter')

module.exports = (io) => {
    io.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('subscribe', function (data) {
            console.log("Subscribe to " + data);
            socket.join(data);
        });
        socket.on('unsubscribe', function(data) {
            socket.leave(data)
        })
    });

    itemChangedEvent.on('changed', function(data) {
        console.log("Sending Out Event: " + JSON.stringify(data));
        io.to(data.orderId).emit('changed', data)
    })
};