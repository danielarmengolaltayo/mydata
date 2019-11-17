module.exports = function (data) {

    settings = {
        color: "blue",
        filter: false,
        linesId: []
    };

    for (let i = 0; i < data.lines.length; i++) {

        if(data.lines[i].aVal === "settings"){

            if(data.lines[i].bVal === "color"){
                settings.color =  "color:" + data.lines[i].c.toString();
                
            }

            if(data.lines[i].bVal === "filter"){

                if(data.lines[i].c === "true"){
                    settings.filter = true;
                }else if(data.lines[i].c === "false"){
                    settings.filter = false;
                }else{
                    // console.log("ERROR settings/filter: expecting true/false instead of " + data.lines[i].c);
                }

            }

            settings.linesId.push(data.lines[i]._id);

        }

    }

    console.log("settings");
    console.log("settings (" + settings.color + ", filter: " + settings.filter + ")");

    return settings;

}


function test(){

}



