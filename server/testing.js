const { appendFile } = require('fs');
var mysql = require('mysql2');
const express = require('express')
const app = express();
const cors = require('cors')
app.use(cors());
app.use(express.json());

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port: 4306,
  database: "testify"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post('/send', async (req, res) => {
  console.log(req.body.topics);
  list = req.body.topics.map((elem) => "\"" + elem + "\"").toString();

  var sql = "INSERT INTO images (image_url, topic, comments) VALUES (\"" + req.body.image_url + "\", JSON_ARRAY(" + list + "), JSON_ARRAY(\"\"))";
  console.log(sql);
  await con.promise().query(sql);
    /*con.query(sql, function (err, result) {
        if (err) throw err; 
        console.log("Image uploaded");
      });*/
})

app.post('/retrieve', async (req, res) => {
    var sql = "SELECT * FROM images WHERE JSON_SEARCH(topic, 'one', '" + req.body.topic + "') IS NOT NULL";
    console.log(req.body.topic);
    var results = await con.promise().query(sql);
    
    res.set('Content-Type', 'application/json');
    if (results) {
      res.json(results[0]);
    }
})

app.listen(5000, () => {
    console.log(`Server is running on port 5000.`);
  });
