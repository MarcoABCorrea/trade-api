import * as express from "express";
import * as _ from "lodash";
import {NextFunction, Request, Response} from "express";
import {Helpers} from "../helpers/Helpers";
import {mongoURI} from "../configs/Mongo";
import {MongoClient} from 'mongodb';

export default class DefaultRoutes {

	app: express.Application;
	collectionName: string;
	route: string;

	protected constructor(route: string, collectionName?: string) {
		this.route = route;
		this.collectionName = collectionName || route;
		this.app = express();
		this.config();
	}

	protected config(): void {
		this.getAll();
		this.getById();
		this.create();
		this.update();
		this.remove();
	}

	protected getAll(): void {
		this.app.get(`/${this.route}`, (req: Request, res: Response) => {

			MongoClient.connect(mongoURI, (connError, dbConnection) => {

				Helpers._fetchAll(dbConnection, this.collectionName, req.query)
					.then((result) => {
						res.status(200).send({payload: result});
					}, (dataError) => {
						res.status(500).send({message: dataError.toString()});
					});
			})

		});
	}

	protected getById(): void {
		this.app.get(`/${this.route}/:id`, (req: Request, res: Response, next: NextFunction) => {

			if (!_.isEmpty(req.params.id)) {
				MongoClient.connect(mongoURI, (connError, dbConnection) => {

					Helpers._fetchById(dbConnection, this.collectionName, req.params.id, req.query.embed)
						.then((result) => {
							res.status(200).send({payload: result});
							dbConnection.close();
						}, (dataError) => {
							res.status(500).send({message: dataError.toString()});
							dbConnection.close();
						});
				})
			} else {
				return next();
			}
		});
	}

	protected create(): void {
		this.app.post(`/${this.route}`, (req: Request, res: Response) => {

			MongoClient.connect(mongoURI, (connError, dbConnection) => {

				Helpers._create(dbConnection, this.collectionName, req.body)
					.then((result) => {
						res.status(201).send({payload: result});
					}, (dataError) => {
						res.status(500).send({message: dataError.toString()});
					})

			})

		});
	}

	protected update(): void {
		this.app.put(`/${this.route}/:id`, (req: Request, res: Response) => {

			if (!_.isEmpty(req.params.id)) {
				MongoClient.connect(mongoURI, (connError, dbConnection) => {

					Helpers._update(dbConnection, this.collectionName, req.params.id, req.body)
						.then((result) => {
							res.status(201).send({payload: result});
						}, (dataError) => {
							res.status(500).send({message: dataError.toString()});
						})

				})
			} else {
				res.status(500).send({message: 'Parametro id nao esta presente ou foi enviado incorretamente'});
			}

		});
	}

	protected remove(): void {
		this.app.delete(`/${this.route}/:id`, (req: Request, res: Response) => {

			if (!_.isEmpty(req.params.id)) {
				MongoClient.connect(mongoURI, (connError, dbConnection) => {

					Helpers._remove(dbConnection, this.collectionName, req.params.id)
						.then((result) => {
							res.status(200).send({payload: result});
						}, (dataError) => {
							res.status(500).send({message: dataError.toString()});
						});

				})
			} else {
				res.status(500).send({message: 'Parametro id nao esta presente ou foi enviado incorretamente'});
			}

		});
	}
}
