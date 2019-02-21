var express = require('express');
var router  = express.Router();
var db = require("./../models");

router.get('/', function(req, res) {
    db.Item.findAll({'RestaurantId': parseInt(restaurantId)}).then((data) => {
        res.json(data);
    });
});

module.exports = router;
