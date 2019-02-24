### **Steps To Execute Project**

##### Prerequisite
* Redis
* Sqlite
* Node v8+


##### Steps

* Install Node dependencies

`cd backend && npm install && npm install --only=dev && cd ..`

`cd client && npm install && npm install --only=dev && cd ..`

* Setup Sqlite db

`cd backend`

`node ./node_modules/sequelize-auto-migrations/bin/runmigration`

`node_modules/.bin/sequelize db:seed:all --debug`

`node scripts/migrateDataToRedis.js`

* Start Server

`cd backend`

`npm run startboth`

* Go to server
`localhost:3000`


### Scope of Project
* Auth is enabled, using JWT
* Each Logged in user can view a list of restaurant
* A restaurant is associated to single order, Due to time limitation, I could not add option for multiple orders. This means at the moment once the order is made by the user from a restaurant, no new order can be created. The DB design and architecture allows for such a feature, but would require more work in UI and API level.
* There is currently only option to add items to order but not to delete orders, the time limitation prevented in the actual implementation, though some interfaces have been added the feature is not fully implemented. The pipeline of data remains the same, but api needs to be added to decrement the entry in redis and db.
* Multiple node setup for the code can be made by using multi node feature of socket.io, which uses Redis as message Broker. This is not implemented at the moment but can be done based on this [https://socket.io/docs/using-multiple-nodes/].
* A person once start adding item can then share the link of the order with other users. The link is copy paste and currently will have to be manually shared. Later we could implement AMP or some sharing plugins.
* The shared links needs authentication and then they can start adding items to orders. They only see the count of items they have added, and not the overall order.
* Any added items are shown back to the order screen of the person initiating the order.
* Once the person initiating the order completes the order no more items can be added by him or the people using the shared links.
* No test cases have been added
* Sequelize has been used as ORM so databases can be switched to mysql or any SQL databases. Since packaging with mysql would have been difficult, hence sqlite is used.

### Details about Project

* The projects implement Node + React + sqlite + Redis setup
* The websocket are implemented using standard Socket.IO library, hence any protocol switching (Long Polling to WS) can be easily made using configuration
* The project maintains caches of where (hash->{key->value}) and (key->value). `backend/helpers/redis.js` contains the connector functions.
    - orderId->restaurantId, 
    - restaurantId->{userId->orderId}, 
    - orderId->{itemId->count}, 
    - orderId:userId->{itemId->count}, // To get items, count for each user in order
    - orderId:itemId->{userId->count}, // To get users, count for each item in order
    - "items"->{itemId->itemDetail(JSON)} // To get the
    - "users"->{userId->userDetail(JSON)
    
  This structure provides application capability to display most of the information to be displayed without querying databases and use of hmget, hgetall, etc api's decrease multiple call to redis.
* EventEmitter Api's are used internally to manage events, this can help to run the code as several process for scaling as well. The eventemitter can be replaced with Redis or ony other message broker or over socket (zeromq) to decouple websocket server from api server.
* Use of SQL database vs NOSQL is just a choice, since I wanted to test out sequelize ORM :).
* Use of React over server side rendering also just a choice :).


### To reset data
`sudo rm backend/db.development.sqlite`

`redis-cli FLUSHALL`