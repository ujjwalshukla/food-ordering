const redis = require('./../helper/redis');
const db = require('./../models');
const { itemChangedEvent } = require('./../helper/eventEmitter');

const orderController = {
    async getCurrentOrderId(userId, restaurantId, createOrder = true) {
        try{
            let currentOrderId = await redis.findCurrentOrderForUser(restaurantId, userId);
            console.log(currentOrderId);

            if(!currentOrderId && createOrder) {
                const newOrder = db.Order.build({
                  shared: false,
                  order_status: false,
                  order_owner: userId,
                    RestaurantId: restaurantId
                });
                let order = await newOrder.save();
                currentOrderId = order.id;
                await redis.addUpdateCurrentOrderForUser(restaurantId, userId, currentOrderId);
            }
            return currentOrderId;
        } catch(e) {
            console.log(e);
            return false;
        }

    },
    async addItemToOrder(orderId, itemId, userId) {
        try {
            await redis.addItemToOrder(orderId, itemId, 1, userId);
            let orderItem = await db.OrderItem.findOne({
                where: {
                    OrderId: orderId,
                    UserId: userId,
                    ItemId: itemId
                }
            });
            if(orderItem) {
                orderItem.increment('quantity', {by: 1});
            } else {
                let orderItem = db.OrderItem.build({
                    quantity: 1,
                    ItemId: itemId,
                    OrderId: orderId,
                    UserId: userId
                });
                orderItem.save();
            }

            itemChangedEvent.emit('changed', {
                itemId,
                orderId,
                userId,
                quantity: await redis.getDetailOfItemInOrder(orderId, itemId),
                item: await redis.getDetailOfItem(itemId)
            });
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    },
    async getOrderDetail(orderId) {
        try {
            return await redis.getListOfItemsInOrder(orderId);
        } catch (e) {
            return {};
        }
    }
};

module.exports = orderController;