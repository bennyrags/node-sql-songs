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
  pool.query('SELECT * FROM "songs" ORDER BY "track";')
  .then((result) => {
      res.send(result.rows);
  })
  .catch((error) => {
      console.log('ERRROR getting all songs', error);
      res.sendStatus(500);     
  })
});
