const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;

const port = 3000;
const app = express();
app.use(bodyParser.urlencoded());

const Tetris = require("./game/tetris-helpers");

// let db;
// mongodb.MongoClient.connect(process.env.MONGODB_URL, (err, client) => {
//     if (err) {
//         console.error(err);
//         process.exit(1);
//     }
//     db = client.db();
//     console.log("☀ Database connection ready!");
// });

// Initialise
app.listen(port, () => console.log(`👂  Listening on port ${port}\n🎮  Please enjoy a fine game of THREETRIS`));    

app.get('*', (req, res) => {
    console.log("☀ GET")
    res.send("<p>Nothing to GET!</p>");
})

// tetris commands
app.post('*', (req, res) => {
    console.log("🌑 POST")
    console.log(req.body.text);
    switch(req.body.text) {
        case "drop":
            while (Tetris.lower()) {};
            break;
        case "down":
            Tetris.lower();
            break;
        case "left":
            Tetris.shift(-1);
            Tetris.lower();
            break;
        case "right":
            Tetris.shift(1);
            Tetris.lower();
            break;
        case "spin":
            Tetris.rotate();
            Tetris.lower();
            break;
    }
    res.set('Content-Type', 'text/plain');
    res.status(200).send("```\n" + Tetris.printMap() + "\n```");
});