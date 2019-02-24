```node_modules/.bin/sequelize model:generate --name order --attributes name:string,shared:boolean,order_status:boolean```



```node ./node_modules/sequelize-auto-migrations/bin/makemigration --name migrate```



```node ./node_modules/sequelize-auto-migrations/bin/runmigration```


```node_modules/.bin/sequelize seed:generate --name demo-user```


```node_modules/.bin/sequelize db:seed:all --debug```


```node_modules/.bin/sequelize db:seed:undo:all```