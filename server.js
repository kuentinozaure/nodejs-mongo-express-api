const express = require("express");
const app = express();
const fs = require("fs");
const pug = require("pug");
const path = require("path");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

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

app.use(express.static(path.join(__dirname, "assets")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const generatedTemplate = compiledFunction({
      utilisateurs: JSON.parse(data)
    });

    res.send(generatedTemplate);
  });
});

app.get("/cities", function(req, res) {
  fs.readFile(datasource, "utf8", (err, data) => {
    if (err) {
      res.status(404).send(err);
    } else {
      const generatedTemplate = compiledFunctionExpress({
        towns: JSON.parse(data)
      });
  
      res.send(generatedTemplate);
    }
  });
});

app.post("/city", function(req, res) {
  // check file
  fs.readFile(datasource, "utf8", (err, data) => {
    if (err) {
      // if file don't exist
      fs.writeFile("cities.json", '{"cities": []}', function(err) {
        if (err) {
          // file cannot create
          res.status(404).send(err);
        } else {
          // file has been created
          let datas = {};
          datas.succes = "your file is created ;)";
          res.send(datas);
        }
      });
    } else {
      // if file exist
      datasFromFile = JSON.parse(data);

      const getValueFromBody = req.body.name;

      let compteurDoccurence = 0;
      datasFromFile.cities.map(x => {
        if (getValueFromBody === x.name) {
          compteurDoccurence += 1;
        }
      });

      if (compteurDoccurence !== 0) {
        res.status(500).send("your element cant be created");
      } else {
        datasFromFile.cities.push({ id: uuidv4(), name: getValueFromBody });
        fs.writeFile("cities.json", JSON.stringify(datasFromFile), function(
          err
        ) {
          if (err) {
            // file cannot create
            res.status(404).send(err);
          } else {
            // file has been updated
            let datas = {};
            datas.succes = "your element has been added :)";
            res.send(datas);
          }
        });
      }
    }
  });
});

app.put("/city/:id", function(req, res) {

  // check file existing
  fs.readFile(datasource, "utf8", (err, data) => {
    if (err) {
      // if file don't exist
      fs.writeFile("cities.json", '{"cities": []}', function(err) {
        if (err) {
          // file cannot create
          res.status(404).send(err);
        } else {
          // file has been created
          let datas = {};
          datas.succes = "your file is created ;)";
          res.send(datas);
        }
      });
    } else {
      // if file exist
      datasFromFile = JSON.parse(data);

      const getValueFromParam = req.params.id;
      const getValueFromBody = req.body.name;
      
      datasFromFile.cities.filter(x => {
        if (getValueFromParam === x.id) {
          x.name = getValueFromBody;
        }
      });

      fs.writeFile("cities.json", JSON.stringify(datasFromFile), function(err) {
        if (err) {
          // file cannot create
          res.status(404).send(err);
        } else {
          // file has been created
          let datas = {};
          datas.succes = "your data has been updated ;)";
          res.send(datas);
        }
      });
    }
  });
});

app.delete("/city/:id", function(req, res) {
  // check file existing
  fs.readFile(datasource, "utf8", (err, data) => {
    if (err) {
      // if file don't exist
      fs.writeFile("cities.json", '{"cities": []}', function(err) {
        if (err) {
          // file cannot create
          res.status(404).send(err);
        } else {
          // file has been created
          let datas = {};
          datas.succes = "your file is created ;)";
          res.send(datas);
        }
      });
    } else {
      // if file exist
      datasFromFile = JSON.parse(data);

      const getValueFromParam = req.params.id;

      let tempValue = datasFromFile;

      tempValue.cities = datasFromFile.cities.filter(x => getValueFromParam !== x.id);

      fs.writeFile("cities.json", JSON.stringify(tempValue), function(err) {
        if (err) {
          // file cannot create
          res.status(404).send(err);
        } else {
          // file has been created
          let datas = {};
          datas.succes = "your data has been deleted ;)";
          res.send(datas);
        }
      });
    }
  });
})


app.listen(port, function() {
  console.log(`➡️  Your server is running on port ${port}`);
  console.log(`➡️  Your data source is ${filename}`);
});
