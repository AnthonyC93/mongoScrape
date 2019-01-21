// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require('mongoose');

// Initialize Express
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
var PORT = 4000;

//handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
if(process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI);
}else{
    mongoose.connect("mongodb://localhost/scrapedInfo", { useNewUrlParser: true });
}

// Require all models
var db = require("./models/articleModel");

// Routes
app.get("/", function(req, res) {

    db.find({})
    .then(function(dbArticles) {
        
        if(dbArticles.length>0){ 
            console.log('successfully found articles');
            let results={
                articles:[]
            }
            for(let i=0;i<dbArticles.length;i++){
                results.articles.push(dbArticles[i]);
            }
            res.render("scraped",results);
        }else{
            res.render("scraped");
        }
    })
    .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });

});

app.get('/scrape',(req,res)=>{
    axios.get('https://arstechnica.com/').then((response)=>{
        var $=cheerio.load(response.data);
        // console.log(response);
        var results={
            articles:[]
        };
        
        $('li.article').each((i,element)=>{
            
            var uglyTitle = $(element).children().find('a').text();
            var link = $(element).children().attr("href");
            var excerpt = $(element).children().find('p.excerpt').text();
            var uglyAuthor = $(element).children().find("span").text();

            if(uglyAuthor && uglyTitle && excerpt && link){
                let author = parseAuthor(uglyAuthor);
                let title = uglyTitle.substring(0,uglyTitle.indexOf(author));

                db.create({
                    title:title,
                    link:link,
                    author:author,
                    excerpt:excerpt,
                    notes:[]
                })
                .then(function(dbArticle) {
                    // If saved successfully, print the new Library document to the console
                    console.log('article added successfully');
                    results.articles.push(dbArticle);
                })
                .catch(function(err) {
                    console.log(err.message);
                });
            }
        })
        res.redirect('/');
    })
})

app.get('/delete/:id',(req,res)=>{
    let id = req.params.id;
    
    db.remove({_id:id})
    .then(function(){
        console.log('removed article');
        res.redirect('/');
    })

})

app.get('/deletenote/:article/:note',(req,res)=>{
    console.log('going to delete note '+req.params.note);
    console.log('from article '+req.params.article);
    //db.getCollection('articles').update({"_id":ObjectId("5c450fc308976941cc17441a")},{ $pull: {'notes': { description: 'wow' } } })
    db.update({_id:req.params.article},{ $pull: { notes: { description: req.params.note } } })
    .then((response)=>{
        console.log(response);
        res.redirect('/');
    })
    .catch(function(err) {
        console.log(err);
    });

})

app.get('/addnote/:article/:note',(req,res)=>{
    console.log('going to add note '+req.params.note);
    console.log('to article '+req.params.article);
    //db.getCollection('articles').update({"_id":ObjectId("5c450fc308976941cc17441a")},{ $pull: {'notes': { description: 'wow' } } })
    db.update({_id:req.params.article},{ $addToSet: { notes: { description: req.params.note } } })
    .then((response)=>{
        console.log(response);
        res.redirect('/');
    })
    .catch(function(err) {
        console.log(err);
    });

})

// Set the app to listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port 4000!");
});

function parseAuthor(author){
    let newAuthor='';
    for(let i=0;i<author.length;i++){
        if(parseInt(author[i])){
            break;
        }else{
            newAuthor += author[i];
        }
    }
    return newAuthor;
}