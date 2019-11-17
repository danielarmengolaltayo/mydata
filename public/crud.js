//CRUD = Create, Read, Update, Delete

module.exports = {

    //////////// CREATE

    createEnt: async function (Ent, self) {
        try{ 
            let ent = new Ent({ self: self });
            ent = await ent.save();
            return ent;
        }catch(err){ console.log("ERROR createEnt: " + err); }
    },
    createInt: async function (Int, a, b, c) {
        try{ 
            let int = new Int({ a: a, b: b, c: c });
            int = await int.save();
            return int._id;
        }catch(err){ console.log("ERROR createInt: " + err); }
    },
    createRel: async function (Rel, idInt) {
        try{ 
            let rel = new Rel();
            rel.list.push(idInt);
            rel = await rel.save();
            return rel._id;
        }catch(err){ console.log("ERROR createRel: " + err); }
    },

    //////////// READ

    findEntBySelf: async function (Ent, s) {
        try{
            let foundEnt = await Ent.findOne({ self: s }, function (err, foundEnt) {
                if (!err) { return foundEnt; }
            });
            return foundEnt;
        }catch(err){ console.log("ERROR findEntBySelf: " + err); }
    },

    //////////// UPDATE

    updateEnt: async function (Ent, idEnt, idRel) {
        try{
            let foundEnt = await Ent.findOne({ _id: idEnt }, function (err, foundEnt) {
                if (!err) { return foundEnt; }
            });
            foundEnt.others.push(idRel);
            await foundEnt.save();
        }catch(err){ console.log("ERROR updateEnt: " + err); }
    },
    updateRel: async function (Rel, idRel, idInt) {
        try{
            let foundRel = await Rel.findOne({ _id: idRel }, function (err, foundRel) {
                if (!err) { return foundRel; }
            });
            foundRel.list.push(idInt);
            await foundRel.save();
        }catch(err){ console.log("ERROR updateRel: " + err); }
    }
};