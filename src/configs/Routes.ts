import {Application} from "express";
import TradeRoutes from "../routes/TradeRoutes";
import UsersRoutes from "../routes/UsersRoutes";

export const RoutesMapping = [
	TradeRoutes,
	UsersRoutes
];

export namespace Routes {
	export function config(app: Application) {
		RoutesMapping.map((route) => {
			app.use(route.app);
		});
	}
}
