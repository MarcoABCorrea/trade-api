import * as express from "express";
import { Request, Response } from "express";
import { MongoClient } from 'mongodb';
import { mongoURI } from "../configs/Mongo";
import { Helpers } from "../helpers/Helpers";

class UsersRoutes {

	app: express.Application;
	route: string;

	constructor() {
		this.app = express();
		this.route = 'stocks';
		this.getStats();
		this.getPrice();
	}

	private getStats(): void {
		this.app.get(`/${this.route}/stats`, (req: Request, res: Response) => {

			MongoClient.connect(mongoURI, (connError, dbConnection) => {

				Helpers._fetchAll(dbConnection, 'trades', req.query)
					.then((result) => {
						res.status(200).send({payload: result});
					}, (dataError) => {
						res.status(500).send({message: dataError.toString()});
					});
			})

		});
	}

	private getPrice(): void {
		this.app.get(`/${this.route}/:stockSymbol/price`, (req: Request, res: Response) => {

			MongoClient.connect(mongoURI, (connError, dbConnection) => {

				Helpers._fetchAll(dbConnection, 'trades', req.query)
					.then((result) => {
						res.status(200).send({payload: result});
					}, (dataError) => {
						res.status(500).send({message: dataError.toString()});
					});
			})

		});
	}
}

export default new UsersRoutes();
