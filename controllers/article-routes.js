var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");
var router = express.Router();


// ============= ROUTES FOR HOME PAGE =============//

// Scrape data from NPR website and save to mongodb
router.get("/scrape", function (req, res) {
    // Grab the body of the html with request
    request("http://www.npr.org/sections/news/archive", function (error, response, html) {
        // Load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        // Grab every part of the html that contains a separate article
        $("article h2").each(function (i, element) {

            // Save an empty result object
            // console.log($(this).text());
            var result = {};

            // Get the title and description of every article, and save them as properties of the result object
            // result.title saves entire <a> tag as it appears on NPR website
            result.title = $(this).text();
            // result.description saves text description
            result.description = $(this).parent().find("a").text();
            result.link = $(this).parent().find("a").attr("href");
            console.log(result);

            // Using our Article model, create a new entry
            var entry = new Article(result);

            // Now, save that entry to the db
            entry.save(function (err, doc) {
                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    console.log(doc);
                }
            });

        });
        // Reload the page so that newly scraped articles will be shown on the page
        res.redirect("/");
    });
});


// This will get the articles we scraped from the mongoDB
router.get("/articles", function (req, res) {
    // Grab every doc in the Articles array
    Article.find({})
        // Execute the above query
        .exec(function (err, doc) {
            // Log any errors
            if (err) {
                console.log(error);
            }
            // Or send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
});

// Save an article
router.post("/save/:id", function (req, res) {
    // Use the article id to find and update it's saved property to true
    Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
        // Execute the above query
        .exec(function (err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            // Log result
            else {
                console.log("doc: ", doc);
            }
        });
});


// ============= ROUTES FOR SAVED ARTICLES PAGE =============//

// Grab an article by it's ObjectId
// router.get("/articles/:id", function (req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     Article.findOne({ "_id": req.params.id })
//         // ..and populate all of the comments associated with it
//         .populate("comments")
//         // now, execute our query
//         .exec(function (error, doc) {
//             // Log any errors
//             if (error) {
//                 console.log(error);
//             }
//             // Otherwise, send the doc to the browser as a json object
//             else {
//                 res.json(doc);
//             }
//         });
// });

// // Remove a saved article
// router.post("/unsave/:id", function (req, res) {
//     // Use the article id to find and update it's saved property to false
//     Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
//         // Execute the above query
//         .exec(function (err, doc) {
//             // Log any errors
//             if (err) {
//                 console.log(err);
//             }
//             // Log result
//             else {
//                 console.log("Article Removed");
//             }
//         });
//     res.redirect("/saved");
// });


module.exports = router;