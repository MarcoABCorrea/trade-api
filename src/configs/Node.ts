import * as bodyParser from 'body-parser';
import {NextFunction, Request, Response} from "express";
import { environment } from '../environments/environment';

export const port = environment.PORT;

export namespace Node {
	export function setup(app) {
		app.use(bodyParser.json({limit: '10mb'}));
		app.use(bodyParser.urlencoded({limit: '10mb', extended: true, parameterLimit: 50000}));

		app.use(function (req: Request, res: Response, next: NextFunction) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});

		app.listen(port, (err) => {
			if (err) {
				return console.error(err)
			}

			return console.log(`server is listening on ${port}`)
		});
	}
}
