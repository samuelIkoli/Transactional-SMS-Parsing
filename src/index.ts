import express, { Request, Response } from 'express';
import { readdirSync } from 'fs';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

app.get('/try', (req: Request, res: Response) => {
    res.send('Hello, world! The thing go skkkkrrrr pa!!!!');
});

readdirSync("./src/routes").map((path) =>
    app.use("/", require(`./routes/${path}`))
);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

export default app;