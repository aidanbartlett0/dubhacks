import express, { Express } from "express";
import { load_guest, load_page, add_guest, save_page, save_guest } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.post("/api/add_guest", add_guest);
app.post("/api/save_guest", save_guest);
app.get("/api/load_guest", load_guest);
app.post("/api/save_page", save_page);
app.get("/api/load_page", load_page);
app.listen(port, () => console.log(`Server listening on ${port}`));
