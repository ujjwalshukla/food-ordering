var express = require('express');
var router  = express.Router();
var db = require("./../models");
const redis = require('./../helper/redis');
const orderController = require('./../controllers/orderController');
const { orderStateChangeEvent } = require('./../helper/eventEmitter');

router.get('/:orderId', async function(req, res) {
    let { userId } = req.user;
    let { orderId } = req.params;
    let orderDetailForUser = await redis.getUserDetailForItemInOrder(orderId, userId);
    let orderStatus = await redis.getOrderStatus(orderId);
    let restaurantId = await redis.getRestaurantForOrderId(orderId);
    db.Item.findAll({where: {'RestaurantId': parseInt(restaurantId)}}).then((data) => {
        console.log({ orderDetailForUser, orderStatus, restaurantId});
        data = data.map(function(item){
            item = item.toJSON();
            // item.quantity = orderDetailForUser[item.id]?parseInt(orderDetailForUser[item.id]):0;
            return item;
        });
        res.json({items: data, orderDetailForUser: orderDetailForUser||{}, orderStatus, restaurantId});
    });
});

router.post('/', async function(req, res) {
    const { userId } = req.user;
    const { orderId, itemId } = req.body;
    let flagAdded = await orderController.addItemToOrder(orderId, itemId, userId);
    if(!flagAdded) {
        res.status(500).json({success: false});
    } else {
        let orderItemStatus = await redis.getDetailOfUserItemInOrder(orderId, userId, itemId);
        console.log(orderItemStatus);
        let orderStatus = await redis.getOrderStatus(orderId);
        console.log({
            itemId,
            orderId,
            userId,
            quantity: orderItemStatus,
            orderStatus
        });
        res.json({
            itemId,
            orderId,
            userId,
            quantity: orderItemStatus,
            orderStatus
        })
    }

});

module.exports = router;
