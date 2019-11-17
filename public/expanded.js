const data_url = "http://localhost:3000/data"

async function getData() {
    const response = await fetch(data_url);
    const data = await response.json();
    console.log(data);
    return data;
}

getData().
    then(data => {
        vizData(data);
    }).
    catch(err => {
        console.log("ERROR?");
        console.error(err);
    });



function vizData(data) {

    // let row;

    // console.log(data.info.int.raw);

    // function createRow(tableName){
    //     return document.getElementById(tableName).appendChild(document.createElement("tr"));
    // }

    // function createCell(row, content){
    //     row.appendChild(document.createElement("td")).innerHTML = content;
    // }




    // row = createRow("info");
    // createCell(row, "entities");
    // row = createRow("info");
    // createCell(row, "— raw");


    for (let i = data.int.length - 1; i >= 0; i--) {


        const int = data.int[i];

        const newTr = document.createElement("tr");

        function newCell(content) {
            const newTd = document.createElement("td");
            const newElement = document.getElementById("data").appendChild(newTr).appendChild(newTd);
            newElement.innerHTML = content;
        }


        Object.keys(int).forEach(function (key) {
            console.log("key=" + key + " value=" + int[key]);



            // const int = data.int[i];



            newCell(int[key]);

            // newCell(int.selfA);
            // newCell(int.selfB);
            // newCell(int.c);
            // newCell(int.d);
            // newCell(int.t);

            // newCell(int.othersA);
            // newCell(int.othersB);
            // newCell(int.lastOfTheDay);
            // newCell(int.lastOfTheSame);

            // newCell(int.a);
            // newCell(int.b);
            // newCell(int._id);
            // newCell(int.date);
            // newCell(int.__v);

        });




        // newCellInsideRow.classList.add("grey");





    }

}

