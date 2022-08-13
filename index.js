var fs = require("fs");
var path = require("path");
var walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (process.cwd() != "node_modules") {
      if (err) return done(err);
      var pending = list.length;
      if (!pending) return done(null, results);
      list.forEach(function (file) {
        file = path.resolve(dir, file);
        fs.stat(file, function (__err, stat) {
          fs.readFile(file, "utf8", (error, data) => {
            if (error) {
              return;
            }
            let found = false;
            while (!found) {
              if (data.includes("console.") == false) {
                found = true;
              }
              data = data.replace(/(?<!\/\/\s)console.*?\);?/, "");
              data = data.replace(/^\s*[\r\n]/gm, "");

              // fs.writeFileSync(file, data, 'utf-8');
              fs.writeFileSync(file, data);
            }
          });
          if (stat && stat.isDirectory()) {
            walk(file, function (err, res) {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            results.push(file);
            if (!--pending) done(null, results);
          }
        });
      });
    }
  });
};

let logRemove = (dir) => {
  walk(dir, function (err, results) {
    if (err) throw err;
    results.forEach((result) => {
      console.log(`${result} ,done 💯`);
    });
    console.log(`all your files are clean ✔`);
  });
};
/*
 import logRemove method any where
 in your project and
 pass the directory to
 start remove console
 messages
*/
module.exports = logRemove;