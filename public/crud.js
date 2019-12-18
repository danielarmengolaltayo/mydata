//CRUD = Create, Read, Update, Delete

module.exports = {

    //////////// CREATE
    createNewEnt: async function (Data, input) {
        try {
            //create new entity
            let ent = new Data.Ent();
            //create new interaction and save the involved entities as the same
            //the new entity is having the first interaction with itself!
            let int = new Data.Int({
                ents: { a: ent._id, b: ent._id },
                context: { c: input, author: "Daniel" }
            });
            //create new relationship
            //for each new interaction a new relationship is established
            let rel = new Data.Rel();
            //push arrays
            rel.ints.push(int._id);
            ent.rels.push(rel._id);
            //save into the database
            await ent.save();
            await rel.save();
            await int.save();
            //return entity
            return ent;
        } catch (err) { console.log("ERROR createEnt: " + err); }
    },
    createNewInt: async function (Int, idEntA, idEntB, c) {
        try {
            //create new interaction between two different entities
            let int = new Int({
                ents: { a: idEntA, b: idEntB },
                context: { c: c, author: "Daniel" }
            });
            //save it into the database
            int = await int.save();
            //return interaction id
            return int._id;
        } catch (err) { console.log("ERROR createInt: " + err); }
    },
    createNewRel: async function (Rel, idInt) {
        try {
            //create new relationship
            let rel = new Rel();
            //push array with the id of the first interaction
            rel.ints.push(idInt);
            //save it into the database
            rel = await rel.save();
            //return relationship id
            return rel._id;
        } catch (err) { console.log("ERROR createRel: " + err); }
    },

    //////////// READ
    checkIfInputIsAnEntity: async function (Ent, Int, input) {
        try {
            //find all interactions matching with input
            let foundInts = await Int.find({ "context.c": input }, function (err, foundInts) {
                if (!err) { return foundInts; }
            });
            //if interactions found
            if (foundInts.length > 0) {
                //loop through them and
                for (let i = 0; i < foundInts.length; i++) {
                    //if an interaction points to an entity relating to itself, find and return the entity
                    if (foundInts[i].ents.a === foundInts[i].ents.b) {
                        let foundEnt = await findById(Ent, foundInts[i].ents.a);
                        return foundEnt;
                    }
                }
                //if no interactions found or not an entity, return null
            } else { return null; }
        } catch (err) { console.log("ERROR checkIfInputIsAnEntity: " + err); }
    },

    //////////// UPDATE

    updateEnt: async function (Ent, idEnt, idRel) {
        try {
            //find entity
            let foundEnt = await findById(Ent, idEnt);
            //add relationship id
            foundEnt.rels.push(idRel);
            //save
            await foundEnt.save();
        } catch (err) { console.log("ERROR updateEnt: " + err); }
    },
    updateRel: async function (Rel, idRel, idInt) {
        try {
            //find relationship
            let foundRel = await findById(Rel, idRel);
            //add interaction id
            foundRel.ints.push(idInt);
            //save
            await foundRel.save();
        } catch (err) { console.log("ERROR updateRel: " + err); }
    },
    updateSet: async function (App, input) {
        try {
            //find
            let foundSet = await App.findOne({}, function (err, foundSet) {
                if (!err) { return foundSet; }
            });
            //update
            foundSet.settings[input] = !foundSet.settings[input];
            //save and return
            await foundSet.save();
            //return
            return foundSet;
        } catch (err) { console.log("ERROR updateSet: " + err); }
    }
};

async function findById(Model, id) {
    try {
        let foundElement = await Model.findOne({ _id: id }, function (err, foundElement) {
            if (!err) { return foundElement; }
        });
        console.log("foundElement:", foundElement);
        return foundElement;
    } catch (err) { console.log("ERROR findById: " + err); }
}