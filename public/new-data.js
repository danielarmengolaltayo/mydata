const crud = require('./crud.js');

//create new entry in the database: 2 entities + 1 interaction + 1 relationship
module.exports = async function (Ent, Int, Rel, inputA, inputB, inputC) {

    const validation = validateInputs(inputA, inputB);
    let log = validation.log;

    if (validation.result) {
        try {
            log = await addDataBase(Ent, Int, Rel, inputA, inputB, inputC);
        } catch (err) { console.log("ERROR newData: " + err); }
    }

    return log;

}


function validateInputs(inputA, inputB) {

    let validation = {};

    //check if first input (required) is empty
    if (inputA === "") {
        validation.log = "error (first input empty)";
        console.log(validation.log);
        validation.result = false;
        return validation;
    } else {
        //check if second input (required) is empty
        if (inputB === "") {
            validation.log = "error (second input empty)";
            console.log(validation.log);
            validation.result = false;
            return validation;
        } else {
            //check if both inputs are the same
            if (inputA === inputB) {
                validation.log = "error (both inputs are the same)";
                console.log(validation.log);
                validation.result = false;
                return validation;
            } else {
                validation.log = "inputs ok";
                validation.result = true;
                return validation;
            }
        }
    }

}


async function addDataBase(Ent, Int, Rel, inputA, inputB, inputC) {

    let entA, entB, idInt, idRel, log;

    // ENTITIES

    // check if required inputs exist in the database
    try {
        entA = await crud.findEntBySelf(Ent, inputA);
        entB = await crud.findEntBySelf(Ent, inputB);
    } catch (err) { console.log("ERROR addDataBase(1): " + err); }

    // if both entities exist in the database, check if they established a relationship before
    if (entA !== null && entB !== null) {
        for (let i = 0; i < entA.others.length; i++) {
            for (let j = 0; j < entB.others.length; j++) {
                if (entA.others[i] === entB.others[j]) {
                    idRel = entA.others[i];
                    break;
                }
            }
            if (idRel !== undefined) break;
        }
    }

    // create entities if they don't exist in the database
    try {
        if (entA === null) entA = await crud.createEnt(Ent, inputA);
        if (entB === null) entB = await crud.createEnt(Ent, inputB);
    } catch (err) { console.log("ERROR addDataBase(2): " + err); }

    // INTERACTIONS

    // if input for "c" is empty, transform it to "undefined" to prevent including it to the database later
    if (inputC === "") inputC = undefined;

    // create new interaction between the two entities
    try {
        idInt = await crud.createInt(Int, entA._id, entB._id, inputC);
    } catch (err) { console.log("ERROR addDataBase(3): " + err); }

    // RELATIONSHIPS

    // create new relationship and update entities or just update existing relationship
    try {
        if (idRel === undefined) {
            idRel = await crud.createRel(Rel, idInt);
            await crud.updateEnt(Ent, entA._id, idRel);
            await crud.updateEnt(Ent, entB._id, idRel);
            log = "new relationship";
        } else {
            await crud.updateRel(Rel, idRel, idInt);
            log = "update relationship";
        }
    } catch (err) { console.log("ERROR addDataBase(4): " + err); }

    return log;

}
