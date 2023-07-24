function gameInit(){
    console.log("salam");
    generateGrid("Enemy");
    generateGrid("Player");
}
//side is a string
function generateGrid(side){
    id = side+"Ground";
    let board = document.getElementById(id);
    for(x=0; x<= 100; x++){
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.id = x;
        board.appendChild(cell);
    }
}
//assigns the function gameInit to the onload event of the window object
window.onload = gameInit;



