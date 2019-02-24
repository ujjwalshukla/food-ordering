import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3000');
function subscribeToOrderId(orderId, cb) {
  socket.on(orderId, data => cb(null, data));
  socket.emit('follow', orderId);
}
function unfollowToOrderId(orderId) {
  socket.on(orderId, data => cb(null, data));
  socket.emit('follow', orderId);
}
export { subscribeToOrderId };