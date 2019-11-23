const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;

const port = process.env.PORT || 3000;
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
app.listen(port, () => console.log(`👂  Listening on port ${port}\n🎮  Please enjoy a fine game of TETRIS`));    

app.get('*', (req, res) => {
    console.log("☀ GET")
    res.send("<p>Nothing to GET!</p>");
})

// tetris commands
app.post('*', (req, res) => {
    console.log("🌑 POST")
    let command = req.body.text;
    console.log(command);
    switch(command) {
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
        default:
            console.log("Couldn't resolve command " + command);
            break;
    }

    let responseDisplay = "```CloudCannon Tetris\nScore: " + Tetris.score() + "\n" + Tetris.printMap() + "\n```";
    let response = {
        "response_type": "in_channel",
        "text": responseDisplay,
    };

    res.set('Content-Type', 'application/json');
    res.status(200).send(response);
    
});