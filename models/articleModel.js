var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var articleSchema = new Schema({

    title: {
        type: String,
        trim: true,
        required: "Title is Required",
        unique:true
    },

    link: {
        type: String,
        trim: true,
        required: "Link is Required"
    },
  
    author: {
        type: String,
        trim: true,
        required: "Author is Required"
    },

    excerpt: {
        type: String,
        trime: true
    },
    // note: {
    //     type: Schema.Types.ObjectId,
    //     ref: "note"
    // }
    notes:[{
        // type:String,
        // minlength:1,
        // trim:true
        description: String,
    }]
  
});

// This creates our model from the above schema, using mongoose's model method
var article = mongoose.model("article", articleSchema);

// Export the User model
module.exports = article;
