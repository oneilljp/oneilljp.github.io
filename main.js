import { name, sEnum, Position, Tile, resize, draw } from "./modules/tile.js";
import { dbfs, visited, searched, found } from "./modules/dbfs.js";
import { dijkstra } from "./modules/dijkstras.js";

// Canvas Creation
// var myCanvas = create('myCanvas', document.body, window.innerWidth, 600);
var rowNum = 60;
var colNum = 20;

// Tile creation
var elements = [];
elements = resize(true, elements, rowNum, colNum);
elements[8][5].color = elements[0][0].type = sEnum.Start;
elements[8][elements[0].length - 6].color = elements[0][
  elements[0].length - 1
].type = sEnum.End;
draw(window.innerWidth, 600, elements);

var start = new Position(8, 5);
var end = new Position(8, elements[0].length - 6);
var key = false;

// Slider Stuff
// let slider = document.getElementById("boardSize");
// var output = document.getElementById("soutput");
// output.innerHTML = slider.value;

// slider.oninput = function () {
// output.innerHTML = this.value;
elements = resize(false, elements, rowNum, colNum);
draw(window.innerWidth, 600, elements);
//draw();
// };

// CLick Listener
var elem = document.getElementById(myCanvas.id),
  elemLeft = elem.offsetLeft + elem.clientLeft,
  elemTop = elem.offsetTop + elem.clientTop;

var listener = function (event) {
  var x = event.pageX - elemLeft,
    y = event.pageY - elemTop;

  for (var i = 0; i < elements.length; ++i) {
    for (var j = 0; j < elements[i].length; ++j) {
      if (
        y > elements[i][j].top &&
        y < elements[i][j].top + elements[i][j].height &&
        x > elements[i][j].left &&
        x < elements[i][j].left + elements[i][j].width
      ) {
        console.log("clicked element x:" + i + " y:" + j);
        var e = document.getElementById("tileType");
        console.log(e.value);
        var type = e.value;

        if (
          (i === start.row && j === start.col) ||
          (i === end.row && j === end.col)
        ) {
          return;
        }

        if (type === sEnum.Wall) {
          if (elements[i][j].type === type) {
            elements[i][j].color = elements[i][j].type = sEnum.Empty;
          } else {
            elements[i][j].color = elements[i][j].type = type;
          }
        } else if (type == sEnum.Start) {
          elements[i][j].color = elements[i][j].type = sEnum.Start;
          elements[start.row][start.col].color = elements[start.row][
            start.col
          ].type = sEnum.Empty;
          start.row = i;
          start.col = j;
        } else if (type == sEnum.Key) {
          if (key && key.row == i && key.col == j) {
            // Remove Key
            elements[i][j].color = elements[i][j].type = sEnum.Empty;
            key = false;
          } else if (key) {
            // Move Key
            elements[key.row][key.col].color = elements[key.row][key.col].type =
              sEnum.Empty;
            elements[i][j].color = elements[i][j].type = sEnum.Key;
            key.row = i;
            key.col = j;
          } else {
            // New Key
            elements[i][j].color = elements[i][j].type = sEnum.Key;
            key = new Position(i, j);
          }
        } else {
          elements[i][j].color = elements[i][j].type = sEnum.End;
          elements[end.row][end.col].color = elements[end.row][end.col].type =
            sEnum.Empty;
          end.row = i;
          end.col = j;
        }

        draw(window.innerWidth, 600, elements);
      }
    }
  }
};

// elem.addEventListener(
//     "click",
//     listener,
//     false
// );

elem.addEventListener("click", listener, false);

var button = document.getElementById("start");
button.onclick = function () {
  var searchType = document.getElementById("searchType");
  var s = searchType.value;

  if (s == "dfs") {
    dbfs(start, end, key, elements, true);
  } else if (s == "bfs") {
    dbfs(start, end, key, elements, false);
  } else if (s == "dijkstra") {
    dijkstra(elements, start, end, key);
  }
};

// Label Coloring

// var dCan = document.getElementById("dColor");
// var dctx = dCan.getContext("2d");
// dctx.fillStyle = visited;
// dctx.fillRect(0, 0, 24, 24);

var vCan = document.getElementById("vColor");
var vctx = vCan.getContext("2d");

// Start Node
var refColors = [
  sEnum.Start,
  sEnum.End,
  sEnum.Key,
  sEnum.Wall,
  searched,
  visited,
  found,
];
var refLabels = [
  "Start Node",
  "End Node",
  "Key",
  "Wall",
  "Searched",
  "Visited",
  "Path-To",
];

vctx.fillStyle = "#4C566A";
vctx.fillRect(10, 0, 192, 250);

for (var i = 0; i < refColors.length; ++i) {
  vctx.fillStyle = refColors[i];
  vctx.fillRect(20, 10 + 30 * i, 24, 24);
  vctx.font = "14px Fira Code";
  vctx.textAllign = "center";
  vctx.fillStyle = "#d8dee9";
  vctx.fillText(refLabels[i], 54, 28 + 30 * i);
}

// vctx.fillStyle = sEnum.Start;
// vctx.fillRect(10, 0, 24, 24);
// vctx.font = "14px Fira Code";
// vctx.fillStyle = sEnum.Start;
// vctx.textAllign = "center";
// vctx.fillText("Start Node", 44, 20);

// // End Node
// vctx.fillStyle = sEnum.End;
// vctx.fillRect(10, 30, 24, 24);
// vctx.font = "14px Fira Code";
// vctx.fillStyle = sEnum.End;
// vctx.textAllign = "center";
// vctx.fillText("End Node", 44, 50);

// // Searched
// vctx.fillStyle = searched;
// vctx.fillRect(10, 60, 24, 24);
// vctx.font = "14px Fira Code";
// vctx.fillStyle = searched;
// vctx.textAllign = "center";
// vctx.fillText("Searched", 44, 80);

// // Visited
// vctx.fillStyle = visited;
// vctx.fillRect(10, 90, 24, 24);
// vctx.font = "14px Fira Code";
// vctx.fillStyle = visited;
// vctx.textAllign = "center";
// vctx.fillText("Visited", 44, 110);

// // Path-To
// vctx.fillStyle = found;
// vctx.fillRect(10, 120, 24, 24);
// vctx.font = "14px Fira Code";
// vctx.fillStyle = found;
// vctx.textAllign = "center";
// vctx.fillText("Path-To", 44, 140);