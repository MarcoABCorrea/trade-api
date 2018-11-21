import DefaultRoutes from "./DefaultRoutes";
import {Request, Response} from "express";
import {databaseName, mongoURI} from "../configs/Mongo";
import {Helpers} from "../helpers/Helpers";
import {MongoClient} from 'mongodb';

class IssueRoutes extends DefaultRoutes {

	constructor() {
		super('issue');

		this.app.get('/issue/status/count', (req: Request, res: Response) => {
			res.send('status count');
		});
	}

	create() {
		this.app.post(`/${this.route}`, (req: Request, res: Response) => {

			MongoClient.connect(mongoURI, (connError, dbConnection) => {

				const workPromise = new Promise((resolve) => {
					dbConnection.db(databaseName)
						.collection('work')
						.findOneAndUpdate({id: Number.parseFloat(req.body.work_id)}, {$inc: {most_recent_issue_number: 1}}, {returnOriginal: false})
						.then(
							result => {
								resolve(result);
							})
				});

				workPromise.then((workResponse: any) => {
					req.body.number = workResponse.value.most_recent_issue_number;
					Helpers._create(dbConnection, this.collectionName, req.body)
						.then((result) => {
							res.status(201).send({payload: result});
						}, (dataError) => {
							res.status(500).send(dataError);
						})
				});

			})

		});
	}

}

export default new IssueRoutes();
