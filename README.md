# Stock Trade API

This project simulates a trade API.

## Stack & Components

This project is using, among other technologies:

Node.js, Express, MongoDB, TypeScript.

## UP & RUNNING
Install dependencies:
```
$ npm install
```
run it locally
```
$ npm start
```

Once the server is running, you can visit `http://localhost:3000/`


Also you'll need a mongod process running according to these configs:

```
	MONGODB_URI: 'mongodb://localhost:27017/trade-api',
	MONGODB_DB_NAME: 'trade-api',
	PORT: 3000
```  

## TODO

* Add mongoose
* Add more specif QueryParameters
* Reinforce some typings
