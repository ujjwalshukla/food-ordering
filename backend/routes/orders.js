var express = require('express');
var router  = express.Router();
var db = require("./../models");
const redis = require('./../helper/redis');
const orderController = require('./../controllers/orderController');

router.get('/', function(req, res) {
    db.Item.findAll({'RestaurantId': parseInt(restaurantId)}).then((data) => {
        res.json(data);
    });
});

router.post('/', async function(req, res) {
    const { userId } = req.user;
    const { itemId, restaurantId } = req.body;

    console.log(userId, itemId, restaurantId);
    let currentOrderId = await orderController.getCurrentOrderId(userId, restaurantId);
    if(!currentOrderId) {
        res.status(500).json({success: false});
        return;
    }
    let flagAdded = await orderController.addItemToOrder(currentOrderId, itemId, userId);
    if(!flagAdded) {
        res.status(500).json({success: false});
    } else {
        let orderItemStatus = await redis.getDetailOfItemInOrder(currentOrderId, itemId);
        res.json({
            itemId,
            orderId: currentOrderId,
            userId,
            quantity: await redis.getDetailOfItemInOrder(currentOrderId, itemId)
        })
    }

});

router.get('/:orderId', async (req, res) => {
    let { userId } = req.user;
    let { orderId } = req.params;
    let restaurantId = await redis.getRestaurantForOrderId(orderId);
    console.log(restaurantId);
    let orderDetail = await redis.getListOfItemsInOrder(orderId);
    let itemList = Object.keys(orderDetail);
    let itemDetail = await redis.getDetailOfItems(itemList);
    let totalAmount = 0;
    itemDetail = itemDetail.map((item) => {
       item.quantity = orderDetail[item.id]?parseInt(orderDetail[item.id]):0;
       totalAmount += item.quantity*item.cost;
       return item;
    });
    res.json({restaurantId, orderDetail, itemDetail, totalAmount})
});

module.exports = router;
