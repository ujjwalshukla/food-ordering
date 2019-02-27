const redis = require('async-redis');
console.log(process.env.REDIS_URL)
const client = redis.createClient(process.env.REDIS_URL);
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
        console.log(`user_item_${orderId}_${userId}`, itemId, count);
        await client.hincrby([`order_${orderId}`, itemId, count]);
        await client.hincrby([`item_${orderId}_${itemId}`, userId, count]);
        await client.hincrby([`user_item_${orderId}_${userId}`, itemId, count]);
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
            await client.hdel([`user_item_${orderId}_${userId}`, itemId]);
        } else if(orderItemCountForUser - count === 0 && orderItemCount - count > 0 ) {
            await client.hincrby([`order_${orderId}`, itemId, count * -1]);
            await client.hdel(`item_${orderId}_${itemId}`, userId);
            await client.hdel([`user_item_${orderId}_${userId}`, itemId]);
        } else if(orderItemCount - count > 0 && orderItemCountForUser - count > 0) {
            await client.hincrby([`order_${orderId}`, itemId, count]);
            await client.hincrby([`item_${orderId}_${itemId}`, userId, count]);
            await client.hincrby([`user_item_${orderId}_${userId}`, itemId, count]);
        } else {
            return false;
        }
        return true;
    },
    findCurrentOrderForUser: async (restaurantId, userId) => {
        return await client.hget(`current_order_${userId}`, restaurantId);
    },
    addUpdateCurrentOrderForUser: async (restaurantId, userId, orderId, status=false) => {
        client.hset(`current_order_${userId}`, restaurantId, orderId);
        client.hset(`order_restaurant`, orderId, restaurantId);
        client.hset(`order_status`, orderId, status)
    },
    getOrderStatus: async (orderId) => {
        return JSON.parse(await client.hget(`order_status`, orderId));
    },
    setOrderAsCompleted: async (orderId) => {
       await client.hset('order_status', orderId, true);
    },
    getRestaurantForOrderId: async (orderId) => {
        return await client.hget('order_restaurant', orderId);
    },
    getDetailOfItemInOrder: async (orderId, itemId) => {
        console.log(`order_${orderId}`);
        return parseInt(await client.hget(`order_${orderId}`, itemId))
    },
    getDetailOfUserItemInOrder: async (orderId, userId, itemId) => {
        console.log(`user_item_${orderId}_${userId}`, itemId);
        return parseInt(await client.hget(`user_item_${orderId}_${userId}`, itemId))
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
    },
    getUserDetailForItemInOrder: async (orderId, userId) => {
        return await client.hgetall([`user_item_${orderId}_${userId}`]);
    }
};