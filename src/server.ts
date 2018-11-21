import * as express from "express";
import {Node} from "./configs/Node";
import {Mongo} from "./configs/Mongo";
import {Routes} from "./configs/Routes";

const app: express.Application = express();

Node.setup(app);
Mongo.setup();
Routes.config(app);
