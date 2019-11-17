module.exports = function (data) {

    let dots, lines = [];
    let val;
    let rel = [];
    let a, b, c, date; 

    for (let i = 0; i < data.dots.length; i++) {
        val = data.dots[i].val;
        console.log(val);
        if(data.dots[i].rel){
            for(let j = 0; j < data.dots[i].rel.length; j++){
                rel[j] = data.dots[i].rel[j];
            }
        }
        console.log(rel);
        dots[i] = {
            val: val,
            rel: rel
        };
    }
    
    for (let i = 0; i < data.lines.length; i++) {
        lines[i].a = data.lines[i].a;
        lines[i].b = data.lines[i].b;
        if(data.lines[i].c){
            lines[i].c = data.lines[i].c;
        }
        lines[i].date = data.lines[i].date;
    }

    const cleanData = {
        dots: dots,
        lines: lines
    };

    console.log("data cleaned");
    return cleanData;

}