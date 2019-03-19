const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");

const app = express();
app.use(express.static("server/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, function() {
  console.log("App listening at port", PORT);
});

//set up pg to talk with our songs db

const Pool = pg.Pool;
const pool = new Pool({
  database: "atbash-songs", //you will change this for EACH app, rest of can be the same
  host: "localhost",
  port: 5432,
  max: 10, //max connections in pool
  idleTimeoutMillis: 30000 // 30 seconds before end of query
});

pool.on("connect", () => {
  console.log("Postgres connected!");
});

pool.on("error", error => {
  console.log("The database has an error:", error);
});

app.get("/songs", (req, res) => {
  //get songs from the DB
  pool
    .query('SELECT * FROM "songs" ORDER BY "track";')
    .then(result => {
      res.send(result.rows);
    })
    .catch(error => {
      console.log("ERRROR getting all songs", error);
      res.sendStatus(500);
    });
});

//add a song to db
//expect a song obj on req body
//properties for track, artist, rank, published
app.post("/songs", (req, res) => {
  let song = req.body;
  // let artist = req.body.artist;
  // let rank = req.body.rank;
  // let published = req.body.published;
  let sqlText = `INSERT INTO "songs" ("rank", "track", "artist", "published") VALUES ($1,$2,$3,$4);`;
  //sql injection can be done here if you DONT do this 
  pool
    .query(sqlText, [song.rank, song.track, song.artist, song.published])

    .then(response => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log("Failed to insert new song, heres the song", song);
      console.log(error);
      res.sendStatus(500);
    });
});
