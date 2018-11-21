import * as express from "express";
import * as _ from "lodash";
import {NextFunction, Request, Response} from "express";
import {Helpers} from "../helpers/Helpers";
import {mongoURI} from "../configs/Mongo";
import {MongoClient} from 'mongodb';
import {databaseName} from "../configs/Mongo";

class TradeRoutes {

	app: express.Application;
	collectionName: string;
	route: string;

	constructor() {
		this.app = express();
		this.route = 'trades';
		this.create();
		this.getAll();
		this.getWithUserId();
		this.eraseAll();
	}

	private create(): void {
		this.app.post(`/${this.route}`, (req: Request, res: Response) => {

			MongoClient.connect(mongoURI, (connError, dbConnection) => {

				Helpers._create(dbConnection, 'trades', req.body)
					.then((result) => {
						res.status(201).send({payload: result});
					}, (dataError) => {
						res.status(400).send({message: dataError.toString()});
					})

			})

		});
	}

	private getAll(): void {
		this.app.get(`/${this.route}`, (req: Request, res: Response) => {

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

	private getWithUserId(): void {
		this.app.get(`/${this.route}/users/:id`, (req: Request, res: Response, next: NextFunction) => {

			if (!_.isEmpty(req.params.id)) {
				MongoClient.connect(mongoURI, (connError, dbConnection) => {

					Helpers._fetchById(dbConnection, 'trades', req.params.id, 'users')
						.then((result) => {
							res.status(200).send({payload: result});
							dbConnection.close();
						}, (dataError) => {
							res.status(404).send({message: dataError.toString()});
							dbConnection.close();
						});
				})
			} else {
				return next();
			}
		});
	}

	private eraseAll(): void {
		this.app.delete(`/erase`, (req: Request, res: Response) => {
			MongoClient.connect(mongoURI, (connError, dbConnection) => {

				new Promise((resolve, reject) => {
					dbConnection.db(databaseName)
						.collection(collectionName, this.fetchCollection)
						.deleteOne({"_id": id}).then(
						result => {
							resolve(result);
							dbConnection.close();
						}, err => {
							reject(err);
							dbConnection.close();
						})
				});
				Helpers._remove(dbConnection, this.collectionName, req.params.id)
					.then((result) => {
						res.status(200).send({payload: result});
					}, (dataError) => {
						res.status(500).send({message: dataError.toString()});
					});

			})
		});
	}
}

export default new TradeRoutes();
