//load data from database into an object called "data"

module.exports = {

    one: async function (mongooseModel) {
        try {
            let data = await findData(mongooseModel);
            console.log("one data loaded");
            return data;
        } catch (err) { console.log("ERROR load data (one): " + err); }
    },

    all: async function (Ent, Int, Rel) {
        try {
            let data = {};
            data.ent = await findData(Ent);
            data.int = await findData(Int);
            data.rel = await findData(Rel);
            console.log("all data loaded");
            return data;
        } catch (err) { console.log("ERROR load data (all): " + err); }
    }

}


async function findData(data) {
    try {
        let foundData = await data.find({}, function (err, foundData) {
            if (!err) {
                if (!foundData) {
                    console.log("no data found");
                } else {
                    console.log("data found");
                    return foundData;
                }
            }
        });
        return foundData;
    } catch (err) { console.log("ERROR finding data: " + err); }
}