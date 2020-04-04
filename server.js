const express = require("express");
const app = express();
const fs = require("fs");
const pug = require("pug");
const path = require("path");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
// mongodb://localhost/TP_Web
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://tpweb:tpweb@cluster0-xya4n.mongodb.net/TP_Web",{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const db = mongoose.connection;

const citiesSchema = new mongoose.Schema({
  name: String,
  id: String
})

const City = mongoose.model('cities', citiesSchema)

db.on("error", console.error.bind(console, 'connection error'))
db.once('open', () => {
});

const port = process.env.PORT || process.argv[2];
const filename = process.argv[3];
const datasource = "cities.json";

if (!port) {
  console.error("Please provide a port number");
  process.exit(1);
}

if (!filename) {
  console.error("Please provide a filename");
  process.exit(1);
}

const compiledFunction = pug.compileFile("NODE_SERVER/template.pug");
const compiledFunctionExpress = pug.compileFile("EXPRESS_SERVER/template.pug");
const compiledFunctionADDCITY = pug.compileFile("EXPRESS_SERVER/addcity.pug");
const compiledFunctionUpdateCITY = pug.compileFile("EXPRESS_SERVER/updatecity.pug");
const compiledFunctiondeletecity = pug.compileFile("EXPRESS_SERVER/deletecity.pug");

app.use(express.static(path.join(__dirname, "assets")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function(req, res) {

  City.find((err, city) => {

    console.log(city)
    if (err) return console.error(err);

    const generatedTemplate = compiledFunctionExpress({
      towns: city
    });
      res.send(generatedTemplate);
  });

});

app.get("/addcity", function(req, res) {
  const generatedTemplate = compiledFunctionADDCITY({
  });
  res.send(generatedTemplate);
});

app.get("/updatecity", function(req, res) {
  const generatedTemplate = compiledFunctionUpdateCITY({
  });
  res.send(generatedTemplate);
});

app.get("/deletecity", function(req, res) {
  const generatedTemplate = compiledFunctiondeletecity({
  });
  res.send(generatedTemplate)
});

app.get("/cities", function(req, res) {

  City.find((err, users) => {
  if (err) return console.error(err);
    res.send(users)
  });

});

app.post("/city", function(req, res) {
  City.find((err, users) => {
      if (err) res.send("error")

      let compteurOccurence = 0;
      users.map(x => {
        if (req.body.name === x.name) {
          compteurOccurence += 1;
        }
      });

      if (compteurOccurence === 0) {
        const city = new City({name: req.body.name,id: uuidv4() })
        city.save((err) => {
          if (err) res.send("error");

          res.send(city);
        })
      }
    });
});

app.put("/city/:id", function(req, res) {
  City.findByIdAndUpdate(req.params.id,{name: req.body.name}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })
});

app.delete("/city/:id", function(req, res) {
  City.findByIdAndDelete(req.params.id, (err,result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })
})


app.listen(port, function() {
  console.log(`➡️  Your server is running on port ${port}`);
  console.log(`➡️  Your data source is ${filename}`);
});
