const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const cors = require("cors");
const socket = require("socket.io");

const loadData = require('./public/load-data.js');
const newData = require('./public/new-data.js');
const updateSettings = require('./public/update-settings.js');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/mydata", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

mongoose.connection.on('error', console.error.bind(console, "Connection error:"));
mongoose.connection.once('open', function () { console.log("Connected to the database."); });

const entitySchema = new mongoose.Schema({
    rels: [{ type: String, required: true }]        //relationships ids
});
const relationshipSchema = new mongoose.Schema({
    ints: [{ type: String, required: true }]        //interactions ids
});
const interactionSchema = new mongoose.Schema({
    ents: {                                         //entities ids
        a: { type: String, required: true },
        b: { type: String, required: true }
    },
    context: {
        c: {                                        //optional input from the user
            type: String,
            minlength: 1,
            maxlength: 200
        },
        date: { type: Date, default: Date.now },    //creation date
        author: { type: String, required: true }    //author id (author as an entity)
    }
});
//capped collection?
//https://stackoverflow.com/questions/12947833/how-do-you-create-a-capped-collection-using-mongoose
const appSchema = new mongoose.Schema({
    settings: {
        showEntities: Boolean,
        showInteractions: Boolean
    },
    ent: [{
        x: Number,                                  //position
        y: Number,
        relsIndex: [Number],                        //relationships indexes
        totalInt: Number                            //total amount of interactions for this entity
    }],
    rel: [{
        a: String,                             //entity id
        b: String,                             //entity id
        aIndex: Number,                             //entity a index
        bIndex: Number,                             //entity b index
        intsIndex: [Number]                         //interactions indexes
    }],
    int: [{
        aNumOfRels: Number,                         //number of relationships for a
        bNumOfRels: Number,                         //number of relationships for b
        aIndex: Number,                             //entity a index
        bIndex: Number,                             //entity b index
        relIndex: Number,                           //relationship index
        d: String,                                  //creation date, shorter version (YYYY-MM-DD)
        t: String,                                  //creation time (HH:MM:SS)
        lastOfTheDay: Boolean,
        lastOfTheSame: Boolean,
    }]
});

//disable versioning
//https://aaronheckmann.tumblr.com/post/48943525537/mongoose-v3-part-1-versioning
entitySchema.set('versionKey', false);
relationshipSchema.set('versionKey', false);
interactionSchema.set('versionKey', false);
appSchema.set('versionKey', false);

const Ent = mongoose.model("Entity", entitySchema);
const Rel = mongoose.model("Relationship", relationshipSchema);
const Int = mongoose.model("Interaction", interactionSchema);
const App = mongoose.model("Application", appSchema);

const Data = { Ent, Rel, Int, App };

//user interface
let ui = {
    log: ""
};

//////////////////////////////////////////////////////
let settings = {};



console.log("hello world");


//////////// GET & POST

app.get("/", function (req, res) {
    res.send("hello");
});

// app.get("/entities", function (req, res) {
//     loadData.one(Ent).then(function (data) {
//         res.render("entities", { data: data });
//     });
// });

// app.get("/interactions", function (req, res) {
//     loadData.one(Int).then(function (data) {
//         res.render("interactions", { data: data });
//     });
// });

// app.get("/relationships", function (req, res) {
//     loadData.one(Rel).then(function (data) {
//         res.render("relationships", { data: data });
//     });
// });

app.post("/new", function (req, res) {

    const input = {
        a: _.trim(req.body.inputA),
        b: _.trim(req.body.inputB),
        c: _.trim(req.body.inputC)
    };

    newData(Data, input).then(function (log) {
        console.log("log: ", log);
        ui.log = log;
        res.redirect("http://localhost:8080/");
    });

});

app.post("/updatesettings", function (req, res) {

    //transform input into the key value in the database
    if (req.body.entities) {
        input = "showEntities";
    } else if (req.body.interactions) {
        input = "showInteractions";
    }

    console.log("update", input);

    updateSettings(Data.App, input).then(function (log) {
        console.log("log: ", log);
        ui.log = log;
        res.redirect("http://localhost:8080/");
    });

});

app.get("/reset", function (req, res) {
    reset().then(function () {
        res.redirect("http://localhost:8080/");
    });
});

app.get("/data", function (req, res) {
    loadData.all(Data).
        then(data => {
            res.send(data);
        }).
        catch(err => {
            console.log("ERROR get /data");
            console.error(err);
            res.send(err);
        });
});

// app.get("/data/:collection", function (req, res) {
//     loadData.one(Data[_.capitalize(req.params.collection)]).
//         then(data => {
//             res.send(data);
//         }).
//         catch(err => {
//             console.log("ERROR get /data/:collection");
//             console.error(err);
//             res.send(err);
//         });
// });






const server = app.listen(3000, function () {
    console.log("Server started on port 3000.");
});

const io = socket(server);
io.on("connection", function (socket) {
    console.log("new connection: " + socket.id);
    socket.emit("hellofromserver", "websockets: hello from server!");
    socket.on("hellofromclient", function (data) {
        console.log(data);
    });
    socket.on("settings", function (req) {

        updateSettings(Data.App, req).then(function (s) {
            console.log("settings: " + req + "(" + s.settings[req] + ")");
            socket.emit("settingsresponse", s.settings);
        });

    });
});



//////////// DELETE (DROP & RESET)



async function reset() {
    try {
        await dropCollection("entities");
        await dropCollection("interactions");
        await dropCollection("relationships");
        await dropCollection("applications");
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