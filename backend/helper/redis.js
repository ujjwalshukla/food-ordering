const redis = require('async-redis');

const client = redis.createClient();
client.on('connect', () => {
    console.log('connected');
});
client.on('error', (e) => {
    console.log(e);
});

module.exports = {
    addItemToOrder: async (orderId, itemId, count, userId) => {
        console.log(`order_${orderId}`, itemId, count);
        console.log(`item_${orderId}_${itemId}`, userId, count);
        await client.hincrby([`order_${orderId}`, itemId, count]);
        await client.hincrby([`item_${orderId}_${itemId}`, userId, count]);
    },
    getListOfItemsInOrder: (orderId) => {
        return client.hgetall(`order_${orderId}`)
    },
    removeItemToOrder: async (orderId, itemId, count, userId) => {
        let orderItemCount = await client.hget(`order_${orderId}`, itemId);
        let orderItemCountForUser = await client.hget(`item_${orderId}_${itemId}`, userId);
        if(orderItemCount - count === 0 && orderItemCountForUser - count === 0) {
            await client.hdel(`order_${orderId}`, itemId);
            await client.hdel(`item_${orderId}_${itemId}`, userId);
        } else if(orderItemCountForUser - count === 0 && orderItemCount - count > 0 ) {
            await client.hincrby([`order_${orderId}`, itemId, count * -1]);
            await client.hdel(`item_${orderId}_${itemId}`, userId);
        } else if(orderItemCount - count > 0 && orderItemCountForUser - count > 0) {
            await client.hincrby([`order_${orderId}`, itemId, count]);
            await client.hincrby([`item_${orderId}_${itemId}`, userId, count]);
        } else {
            return false;
        }
        return true;
    },
    findCurrentOrderForUser: async (restaurantId, userId) => {
        return await client.hget(`current_order_${userId}`, restaurantId);
    },
    addUpdateCurrentOrderForUser: async (restaurantId, userId, orderId) => {
        client.hset(`current_order_${userId}`, restaurantId, orderId);
        client.hset(`order_restaurant`, orderId, restaurantId);
    },
    getRestaurantForOrderId: async (orderId) => {
        return await client.hget('order_restaurant', orderId);
    },
    getDetailOfItemInOrder: async (orderId, itemId) => {
        console.log(`order_${orderId}`);
        return parseInt(await client.hget(`order_${orderId}`, itemId))
    },
    deleteItemHash: async () => {
        await client.del('items');
    },
    deleteUserHash: async () => {
        await client.del('users');
    },
    addItems: async (itemId, name) => {
        return await client.hset(`items`, itemId, name);
    },
    addUsers: async (userId, name) => {
        return await client.hset(`users`, userId, name);
    },
    getDetailOfItems: async (itemList) => {
        let items = await client.hmget('items', itemList);
        return items.map(JSON.parse)
    },
    getDetailOfItem: async (itemId) => {
        return JSON.parse(await client.hget('items', itemId))
    }
};