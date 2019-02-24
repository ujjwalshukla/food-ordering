const redis = require('./../helper/redis');
const db = require('./../models');

db.Item.findAll().then(async (data) => {
    await redis.deleteItemHash();
    data.forEach(async (item) => {
        await redis.addItems(item.id, JSON.stringify({id: item.id, name: item.name, cost: item.cost}));
    })
});

db.User.findAll().then(async (data) => {
    await redis.deleteUserHash();
    data.forEach(async (user) => {
        await redis.addUsers(user.id, user.username);
    })
});