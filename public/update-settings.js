const crud = require('./crud.js');

//update settings
module.exports = async function (app, input) {

    let log;

    try {
        let s = await crud.updateSet(app, input);
        return s;
    } catch (err) { console.log("ERROR updateDataBase: " + err); }

    // return log;
    // return s;

}