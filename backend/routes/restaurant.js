var express = require('express');
var router  = express.Router();
var db = require("./../models");
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
    if(orderId) {
        orderDetail = await orderController.getOrderDetail(orderId);
    }
    res.json({orderId, orderDetail});
});


module.exports = router;
