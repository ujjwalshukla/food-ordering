'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Restaurants", deps: []
 * createTable "Users", deps: []
 * createTable "Items", deps: [Restaurants]
 * createTable "Orders", deps: [Users]
 * createTable "OrderItems", deps: [Items, Orders, Users]
 *
 **/

var info = {
    "revision": 1,
    "name": "addData",
    "created": "2019-02-21T13:36:51.463Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "Restaurants",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name"
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Users",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "username": {
                    "type": Sequelize.STRING,
                    "field": "username",
                    "unique": true,
                    "allowNull": true
                },
                "password": {
                    "type": Sequelize.STRING,
                    "field": "password",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Items",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name"
                },
                "cost": {
                    "type": Sequelize.INTEGER,
                    "field": "cost"
                },
                "RestaurantId": {
                    "type": Sequelize.INTEGER,
                    "field": "RestaurantId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Restaurants",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Orders",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "shared": {
                    "type": Sequelize.BOOLEAN,
                    "field": "shared"
                },
                "order_status": {
                    "type": Sequelize.BOOLEAN,
                    "field": "order_status"
                },
                "order_owner": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true,
                    "field": "order_owner"
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "OrderItems",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "quantity": {
                    "type": Sequelize.INTEGER,
                    "field": "quantity"
                },
                "added_by": {
                    "type": Sequelize.INTEGER,
                    "field": "added_by"
                },
                "item_added": {
                    "type": Sequelize.INTEGER,
                    "field": "item_added"
                },
                "ItemId": {
                    "type": Sequelize.INTEGER,
                    "field": "ItemId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Items",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "OrderId": {
                    "type": Sequelize.INTEGER,
                    "field": "OrderId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Orders",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "UserId": {
                    "type": Sequelize.INTEGER,
                    "field": "UserId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
