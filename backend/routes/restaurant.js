var express = require('express');
var router  = express.Router();
var db = require("./../models");

router.get('/', function(req, res) {
    db.Restaurant.findAll({}).then((data) => {
        res.json(data);
    });
});

router.get('/:restaurantId', function(req, res) {
    let restaurantId = req.params.restaurantId;
    console.log(req.params)
    db.Item.findAll({where: {'RestaurantId': parseInt(restaurantId)}}).then((data) => {
        res.json(data);
    });
});


module.exports = router;
