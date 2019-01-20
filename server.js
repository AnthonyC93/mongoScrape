// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
var cheerio = require("cheerio");
var axios = require("axios");

// Initialize Express
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
var PORT = 4000;

//handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "scrapedInfo";
var collections = ["articles","notes"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Routes
// 1. At the root path, send a simple hello world message to the browser
app.get("/", function(req, res) {
    res.render("index");
});

app.get('/scrape',(req,res)=>{
    axios.get('https://arstechnica.com/').then((response)=>{
        var $=cheerio.load(response.data);
        // console.log(response);
        var results=[];

        // $('ul.headlineStack__list').each((i,element)=>{
        //     var title=$(element).children().find('a').text();
        //     results.push(title);
        // })
        $('li.article').each((i,element)=>{
            
            var title = $(element).children().find('a').text();
            var link = $(element).children().attr("href");
            var excerpt = $(element).children().find('p.excerpt').text();
            var author = $(element).children().find("span").text();
     
            results.push({
                link:link,
                title:title,
                excerpt:excerpt,
                author:author
            })
        })
        console.log(results);
    })
})

// // 2. At the "/all" path, display every entry in the animals collection
// app.get("/all", function(req, res) {
//   // Query: In our database, go to the animals collection, then "find" everything
//   db.animals.find({}, function(error, found) {
//     // Log any errors if the server encounters one
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise, send the result of this query to the browser
//     else {
//       res.json(found);
//     }
//   });
// });

// // 3. At the "/name" path, display every entry in the animals collection, sorted by name
// app.get("/name", function(req, res) {
//   // Query: In our database, go to the animals collection, then "find" everything,
//   // but this time, sort it by name (1 means ascending order)
//   db.animals.find().sort({ name: 1 }, function(error, found) {
//     // Log any errors if the server encounters one
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise, send the result of this query to the browser
//     else {
//       res.json(found);
//     }
//   });
// });

// // 4. At the "/weight" path, display every entry in the animals collection, sorted by weight
// app.get("/weight", function(req, res) {
//   // Query: In our database, go to the animals collection, then "find" everything,
//   // but this time, sort it by weight (-1 means descending order)
//   db.animals.find().sort({ weight: -1 }, function(error, found) {
//     // Log any errors if the server encounters one
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise, send the result of this query to the browser
//     else {
//       res.json(found);
//     }
//   });
// });

// Set the app to listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port 4000!");
});
