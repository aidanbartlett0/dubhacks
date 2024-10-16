import express, { Express } from "express";
import {getdb}from './mongdb'
import bodyParser from 'body-parser';
// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/mgdb", getdb);
app.listen(port, () => console.log(`Server listening on ${port}`));