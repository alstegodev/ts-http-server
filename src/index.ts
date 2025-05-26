import express, {NextFunction, Request, Response} from "express";
import {API_CONFIG} from "./config.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("public"));


app.get("/api/healthz", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.send("OK");
});

app.post("/api/validate_chirp", (req, res) => {

    const chirp: { body: string } = req.body

    const validResponse: { valid: boolean } = {
        valid: chirp.body.length <= 140,
    }
    const validBody = JSON.stringify(validResponse);
    res.header('Content-Type', 'application/json')
    res.status(200).send(validBody);
    res.end();

})

app.get("/admin/metrics", (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(`<html>
    <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${API_CONFIG.fileserverHits} times!</p>
    </body>
    </html>`);
});

app.post("/admin/reset", (req, res) => {
    API_CONFIG.fileserverHits = 0;
    res.send("OK");
});

app.use(middlewareErrorHandling)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {

    res.on("finish", () => {
        if (res.statusCode != 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
        }
    })
    next();
}

function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {

    API_CONFIG.fileserverHits++;
    next();
}

function middlewareErrorHandling(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    res.status(500).send({
        error: 'Something went wrong on our end',
    });
}