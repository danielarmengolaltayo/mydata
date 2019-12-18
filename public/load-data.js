//load data from database into an object called "data"

module.exports = {

    one: async function (mongooseModel) {
        try {
            let data = await findData(mongooseModel);
            console.log("one data loaded");
            return data;
        } catch (err) { console.log("ERROR load data (one): " + err); }
    },

    all: async function (Data) {
        try {
            let data = {};
            data.ent = await findData("ent", Data.Ent);
            data.rel = await findData("rel", Data.Rel);
            data.int = await findData("int", Data.Int);
            data.app = await findData("app", Data.App);
            return data;
        } catch (err) { console.log("ERROR load data (all): " + err); }
    }

}

async function findData(msg, data) {
    try {
        let foundData = await data.find({}, function (err, foundData) {
            if (!err) {
                if (!foundData) {
                    console.log(msg + ": no data found");
                } else {
                    if (foundData.length === 0) {
                        console.log(msg + ": the database is empty");
                        //init app if empty
                        if (msg === "app") { initApp(data); }
                    } else {
                        console.log(msg + ": data found");
                    }
                    return foundData;
                }
            }
        });
        return foundData;
    } catch (err) { console.log("ERROR finding data: " + err); }
}

async function initApp(d) {
    let app = new d({
        settings: {
            showEntities: false,
            showInteractions: false
        }
    });
    await app.save();
    console.log("app initialized");
}