var express = require('express');
var router  = express.Router();
var db = require("./../models");
const redis = require('./../helper/redis');
const orderController = require("./../controllers/orderController");

router.get('/', function(req, res) {
    db.Restaurant.findAll({}).then((data) => {
        res.json(data);
    });
});

router.get('/:restaurantId', function(req, res) {
    let restaurantId = req.params.restaurantId;
    console.log(req.params);
    db.Item.findAll({where: {'RestaurantId': parseInt(restaurantId)}}).then((data) => {
        res.json(data);
    });
});

router.get('/:restaurantId/order', async function(req, res) {
    let { restaurantId } = req.params;
    let { userId } = req.user;
    console.log(req.params);
    let orderId = await orderController.getCurrentOrderId(userId, restaurantId, false);
    let orderDetail = {};
    let orderStatus = false;
    if(orderId) {
        orderDetail = await orderController.getOrderDetail(orderId);
        orderStatus = await redis.getOrderStatus(orderId)
    }
    res.json({orderId, orderDetail, orderStatus});
});


module.exports = router;
