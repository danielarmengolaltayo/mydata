const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const loadData = require('./public/load-data.js');
const cleanData = require('./public/clean-data.js');
const expandData = require('./public/expand-data.js');
const newData = require('./public/new-data.js');
const loadSettings = require('./public/load-settings.js');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/mydata", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

mongoose.connection.on('error', console.error.bind( console, "Connection error:" ));
mongoose.connection.once('open', function () { console.log("Connected to the database."); });

const entitySchema = new mongoose.Schema({
    //input from the user, defining the entity
    self: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200
    },
    //list of relationships with other entities
    //one relationship for each pair of entities
    //each relationship is formed by multiple interactions over time
    others: {
        type: [String]
    }
});

const interactionSchema = new mongoose.Schema({
    //entity id
    a: {
        type: String,
        required: true
    },
    //entity id
    b: {
        type: String,
        required: true
    },
    //optional input from the user, connecting both entities
    c: {
        type: String,
        minlength: 1,
        maxlength: 200
    },
    //creation date
    date: {
        type: Date,
        default: Date.now
    }
});

const relationshipSchema = new mongoose.Schema({
    //list of interactions between pairs of entities
    list: {
        type: [String]
    }
});

//disable versioning
//https://aaronheckmann.tumblr.com/post/48943525537/mongoose-v3-part-1-versioning
entitySchema.set('versionKey', false);
entitySchema.set('versionKey', false);
entitySchema.set('versionKey', false);

const Ent = mongoose.model("Entity", entitySchema);
const Int = mongoose.model("Interaction", interactionSchema);
const Rel = mongoose.model("Relationship", relationshipSchema);

//user interface
let ui = {
    log: ""
};

//////
let settings = {};



console.log("hello world");


//////////// GET & POST

app.get("/", function (req, res) {

    // loadData(Dot, Line).
    //     then(data => {
    //         console.log("data loaded");
    //         data = expandData(data);
    //         console.log("data expanded");
    //         settings = loadSettings(data);
    //         res.render("simple-render", { listDots: data.dots, listLines: data.lines, settings: settings, log: "last log: " + ui.log });
    //     }).
    //     catch(err => {
    //         console.log("ERROR load data (2)");
    //         console.error(err);
    //         res.send(err);
    //     });

});

app.get("/entities", function (req, res) {
    loadData.one(Ent).then(function (data) {
        res.render("entities", { data: data });
    });
});

app.get("/interactions", function (req, res) {
    loadData.one(Int).then(function (data) {
        res.render("interactions", { data: data });
    });
});

app.get("/relationships", function (req, res) {
    loadData.one(Rel).then(function (data) {
        res.render("relationships", { data: data });
    });
});

app.get("/expanded", function (req, res) {
    res.sendFile(__dirname + "/public/expanded.html");
});

app.post("/new", function (req, res) {

    const inputA = _.trim(req.body.ant);
    const inputB = _.trim(req.body.bat);
    const inputC = _.trim(req.body.connection);

    newData(Ent, Int, Rel, inputA, inputB, inputC).then(function (log) {
        console.log(log);
        ui.log = log;
        res.redirect("/render");
    });

});

app.get("/reset", function (req, res) {
    reset().then(function () {
        res.redirect("/render");
    });
});


app.get("/data", function (req, res) {
    loadData.all(Ent, Int, Rel).
        then(data => {
            data = expandData(data);
            res.send(data);
        }).
        catch(err => {
            console.log("ERROR load data (2)");
            console.error(err);
            res.send(err);
        });
});

app.get("/render", function (req, res) {
    res.sendFile(__dirname + "/public/render.html");
});






app.listen(3000, function () {
    console.log("Server started on port 3000.");
});





//////////// DELETE (DROP & RESET)



async function reset() {
    try {
        await dropCollection("entities");
        await dropCollection("interactions");
        await dropCollection("relationships");
    } catch (err) { console.log("ERROR reset: " + err); }
}

async function dropCollection(collection) {
    mongoose.connection.collections[collection].drop(function (err) {
        console.log("drop " + collection + " collection");
    });
}

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
    // via: https://medium.com/dailyjs/how-to-prevent-your-node-js-process-from-crashing-5d40247b8ab2
})