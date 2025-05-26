import express, {NextFunction, Request, Response} from "express";
import {API_CONFIG} from "./config.js";
import {clearUsers, createUser} from "./db/queries/user.js";
import {createChirp, getChirps, getSingleChirp} from "./db/queries/chirp.js";

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

app.post("/api/users", async (req, res) => {
    const user: {email: string} = req.body

    const dbResponse = await createUser(user)
    const responseBody = JSON.stringify(dbResponse)

    res.header('Content-Type', 'application/json')
    res.status(200).send(responseBody);
    res.end()
})

app.post("/api/chirps", async (req, res) => {
    const chirp: {body: string, userId: string} = req.body

    if(chirp.body.length > 140) {
        res.status(400).send("Chirp is too long")
    } else {
        const dbResponse = await createChirp(chirp)
        const responseBody = JSON.stringify(dbResponse)
        res.header('Content-Type', 'application/json')
        res.status(201).send(responseBody);
        res.end()
    }


})

app.get("/api/chirps", async (req, res) => {
    const dbResponse = await getChirps()
    const responseBody = JSON.stringify(dbResponse)
    res.header('Content-Type', 'application/json')
    res.status(200).send(responseBody);
})

app.get("/api/chirps/:id", async (req, res) => {
    const dbResponse = await getSingleChirp(req.params.id)
    if(dbResponse === undefined) {
        res.status(404).send("Not found")
        return
    }
    const responseBody = JSON.stringify(dbResponse)
    res.header('Content-Type', 'application/json')
    res.status(200).send(responseBody);
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
    if(API_CONFIG.platform !== "dev") {
        res.status(403).send("Forbidden");
    } else {
        API_CONFIG.fileserverHits = 0;
        clearUsers();
        res.send("OK");
    }

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