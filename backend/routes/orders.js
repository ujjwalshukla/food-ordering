var express = require('express');
var router  = express.Router();
var db = require("./../models");
const redis = require('./../helper/redis');
const orderController = require('./../controllers/orderController');
const { orderStateChangeEvent } = require('./../helper/eventEmitter');

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
        let orderStatus = await redis.getOrderStatus(currentOrderId);
        res.json({
            itemId,
            orderId: currentOrderId,
            userId,
            quantity: orderItemStatus,
            orderStatus
        })
    }

});

router.post('/complete', async (req, res) => {
    let { userId } = req.user;
    let { orderId } = req.body;
    db.Order.findOne({
        where: {id: orderId}
    }).then((order) => {
       order.order_status = true;

       order.save().then(()=>{
           redis.setOrderAsCompleted(orderId);
           orderStateChangeEvent.emit('changed', {orderId, orderStatus: true});
           res.json({success: true})

       })
    });
});


router.get('/:orderId', async (req, res) => {
    let { userId } = req.user;
    let { orderId } = req.params;
    let restaurantId = await redis.getRestaurantForOrderId(orderId);
    console.log(restaurantId);
    let orderDetail = await redis.getListOfItemsInOrder(orderId);
    let itemList = Object.keys(orderDetail);
    let itemDetail = await redis.getDetailOfItems(itemList);
    let orderStatus = await redis.getOrderStatus(orderId);
    itemDetail = itemDetail.map((item) => {
       item.quantity = orderDetail[item.id]?parseInt(orderDetail[item.id]):0;
       return item;
    });
    res.json({restaurantId, orderDetail, itemDetail, orderStatus})
});


module.exports = router;
