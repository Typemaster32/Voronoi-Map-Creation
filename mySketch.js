let c_grass1; //land(seaside)
let c_grass2; //innerLand
let c_grass3; //summit
let c_mountain1; //mountain
let c_mountain2; //mountain top
let c_mountain3; //summit
let c_town1; //town
let c_town2; //port
let c_water1; //sea
let c_water2; //ocean
let c_water3; //ocean
let clist = []; //list of color designed for 8 types
let nlist = []; //list of the number for 4 major types
let num;
let numSea = 8;
let numMountain = 20;
let numTown = 2;
let numPort = 2;
function setup() {
  // console.log('test');
  nlist = [800, 35, 2, 25, 1];
  //ALL,mountain,town,water,town,port;
  num = nlist[0];
  createCanvas(windowWidth, windowHeight);
  voronoiRndSites(num, 20);
  /*
  basic settings about numbers
  */
  c_grass1 = color("#cdc9b0");
  c_grass2 = color("#58bd4e");
  c_mountain1 = color("#906f50");
  c_mountain2 = color("#c8b396");
  c_town1 = color("#0097c5");
  c_town2 = color("#0097c5");
  // c_town1 = color("#d68f1c");
  // c_town2 = color("#424242");
  c_water1 = color("#0097c5");
  c_water2 = color("#03769d");
  c_water3 = color("#034b71");
  c_grass3 = color("#4aa341");
  c_mountain3 = color("#fbfaff");
  //c_mountain3 = color("#ff0000");
  c_grass4 = color("#3d6f36");
  clist = [
    c_grass1, //0
    c_grass2, //1
    c_mountain1, //2
    c_mountain2, //3
    c_town1, //4
    c_town2, //5
    c_water1, //6
    c_water2, //7
    c_water3, //8
    c_mountain3, //9
    c_grass3, //10
    c_grass4, //11
  ];
  //colors, more to come;
  voronoiCellStrokeWeight(0);
  voronoiSiteStrokeWeight(0);
  voronoiSiteFlag(false);
  voronoiJitterStepMax(20);
  voronoiJitterStepMin(7);
  voronoiJitterFactor(5);
  voronoiJitterBorder(true);
  voronoi(width, height, true);
  //Get the raw diagram, for more advanced use
  // var diagram = voronoiGetDiagram();
  // console.log("diagram");
  // console.log(diagram);
  /*
all above are the settings of the voronoi graph, 
preparation's now done. here's next:
1. put all cells as grass;
2. get CONNECTED water cells as sea and ISOLATED water cells 
as ocean;
3. everything not in sea, is land;
4. get ISOLATED land cells as inner land
5. put a mountain with CONNECTED cells in inner land;
4. get ISOLATED mountain cells as mountain top;
5. get ALL grass cells and put a town with CONNECTED cells;
(maybe MULTIPLE)
6. get ISOLATED town cells as downtowns;
*/
  let land = [];
  for (let i = 0; i < num; i++) {
    voronoiChangeColor(i, clist[0]);
  }
  for (let i = 0; i < num; i++) {
    land.push(i);
  }
  /*
  1.put everything as land
  */
  let sea = [];
  for (let i = 0; i < numSea; i++) {
    let seaStart = land[int(random(land.length))];
    let seaNow = getConnected(seaStart, nlist[3], 6, land);
    for (let j = 0; j < seaNow.length; j++) {
      let index = land.indexOf(seaNow[j]);
      if (index !== -1) {
        land.splice(index, 1);
      }
    }
    sea = sea.concat(seaNow);
    let uniqueSeaArray = Array.from(new Set(sea));
    sea = uniqueSeaArray;
  }
  let ocean = getIsolatedAndPaint(sea, 7);
  let deepOcean = getIsolatedAndPaint(ocean, 8);
  /*
  2.Generate the sea (first water). 
  */
  let offshore = [];
  let innerLand = getIsolatedAndPaint(land, 1);
  for (let i = 0; i < land.length; i++) {
    let index = innerLand.indexOf(land[i]);
    if (index == -1) {
      offshore.push(land[i]);
    }
  }

  let forest = getIsolatedAndPaint(innerLand, 10);
  let innerForest = getIsolatedAndPaint(forest, 11);
  let coreForest = getIsolatedAndPaint(innerForest, 0);
  /*
  3.collect the inner land area and seaside area.
  */
  let mountain = [];
  for (let i = 0; i < numMountain; i++) {
    let mountainStart = coreForest[int(random(coreForest.length))];
    let mountainNow = getConnected(mountainStart, nlist[1], 2, coreForest);
    for (let j = 0; j < mountainNow.length; j++) {
      let index = coreForest.indexOf(mountainNow[j]);
      if (index !== -1) {
        coreForest.splice(index, 1);
      }
    }
    mountain = mountain.concat(mountainNow);
    let uniqueMountainArray = Array.from(new Set(mountain));
    mountain = uniqueMountainArray;
  }
  let mountaintop = getIsolatedAndPaint(mountain, 3);
  let summit = getIsolatedAndPaint(mountaintop, 9);
  /*
  4.put mountains on the inner land area;
  */
  // let town = [];
  // for (let i = 0; i < numTown; i++) {
  //   let townStart = innerLand[int(random(innerLand.length))];
  //   let townNow = getConnected(townStart, nlist[2], 4, innerLand);
  //   for (let j = 0; j < townNow.length; j++) {
  //     let index = innerLand.indexOf(townNow[j]);
  //     if (index !== -1) {
  //       innerLand.splice(index, 1);
  //     }
  //   }
  //   town = town.concat(townNow);
  // }
  /*
  5.put towns on the inner land area;
  (CAN IT BE ALWAYS BY THE MOUNTAIN?)
  */
  let port = [];
  for (let i = 0; i < numTown; i++) {
    let portStart = offshore[int(random(offshore.length))];
    let portNow = getConnected(portStart, nlist[4], 5, offshore);
    for (let j = 0; j < portNow.length; j++) {
      let index = offshore.indexOf(portNow[j]);
      if (index !== -1) {
        offshore.splice(index, 1);
      }
    }
    port = port.concat(portNow);
  }
  /*
  6.put ports on the inner land area;
  (CAN IT BE ALWAYS THE CORNER?)
  */
  /*
  MORE TO DO:
  1. make multiple seas and mountains and towns;DONE
  2. correct getConnected;DONE
  3. rule towns;
  4. clear the islands inside of mountains;
  */
  voronoiDraw(0, 0, true, true);
}

function getConnected(id, n, t, realm) {
  /*
  id:id of the starting cell; 
  n:number of cells to change color; 
  t:type of target; 
  realm:the array of field to choose from
  IF realm == 0, it means ALL;
  */
  let connectedIds = [];
  let fillcolor = clist[t];
  let nextIdChoiceArray = voronoiNeighbors(id);
  let nextIdChoice = nextIdChoiceArray[int(random(nextIdChoiceArray.length))];
  let nextIdTest = nextIdChoiceArray[0];
  for (let i = 0; i < n; i++) {
    let isolated = true;
    for (let j = 0; j < nextIdChoiceArray.length; j++) {
      nextIdTest = nextIdChoiceArray[0];
      if (realm.includes(nextIdTest)) {
        isolated = false;
      }
    }
    if (isolated) {
      break;
    } else {
      while (realm.includes(nextIdChoice) == false) {
        nextIdChoice = nextIdChoiceArray[int(random(nextIdChoiceArray.length))];
      }
      connectedIds.push(id);
      voronoiChangeColor(id, fillcolor);
      id = nextIdChoice;
      nextIdChoiceArray = voronoiNeighbors(id);
      nextIdChoice = nextIdChoiceArray[int(random(nextIdChoiceArray.length))];
    }
  }
  let uniqueArray = Array.from(new Set(connectedIds));
  return uniqueArray;
}

function getAllWithColor(t) {
  //t:type to search
  let targetArray = [];
  for (let i = 0; i < n; i++) {
    if (voronoiGetColor(n) == t) {
      targetArray.push(i);
    }
  }
  return targetArray;
}

function getIsolatedAndPaint(array, t) {
  /*
  array: array of the searching field; 
  t:the color to be given to the isolated cells
  IF t==0, cells won't get painted
  */
  let n = num;
  let neighborIds = [];
  let isolatedIds = [];
  for (let i = 0; i < num; i++) {
    if (array.includes(i)) {
      neighborIds = voronoiNeighbors(i);
      let isIsolated = true;
      for (let j = 0; j < num; j++) {
        if (neighborIds.includes(j)) {
          if (!array.includes(j)) {
            isIsolated = false;
          }
        }
      }
      if (isIsolated) {
        isolatedIds.push(i);
        if (t !== 0) {
          voronoiChangeColor(i, clist[t]);
        }
      }
    }
  }
  return isolatedIds;
}

function keyReleased() {
  if (key == 's' || key == 'S') {
    saveCanvas('Voronoi_Map_Creation_Jiaqi_Yi', 'png');
  } else if (key == 'r' || key == 'R') {
    clear();
    setup();
  }
}


function mousePressed() {
  clear();
  setup();
}