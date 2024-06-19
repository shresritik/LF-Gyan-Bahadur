// Image imports
const images = {
  grapes: "./src/assets/grapes.png",
  banana: "./src/assets/banana.png",
  corona: "./src/assets/corona.png",
  singleFire: "./src/assets/single-fire.png",
  wall: "./src/assets/wall.png",
  flag: "./src/assets/single-flag.png",
  animal: "./src/assets/dog1.png",
};

// Define a type for the keys of the images object
type ImageKey = keyof typeof images;

// State variables for tile selection
let selectedTile: ImageKey | null = null;

// Map object
interface MapObject {
  map: number[][];
}

const rows = 20;
const cols = 120;
let mapObj: MapObject = createMapObj(rows, cols);

// Create table element and append to document body
const tableEl = document.createElement("table");
document.body.append(tableEl);

let visibleStartIndex = 0; // Start by showing the first 20 columns
let isMouseDown = false;

// Function to create map object
function createMapObj(rows: number, cols: number): MapObject {
  const map = Array.from({ length: rows }, () => Array(cols).fill(0));
  return { map };
}

// Function to handle tile selection
function selectTile(tile: ImageKey) {
  selectedTile = tile;
}

// Function to save map to local storage
function save() {
  const saveMap = JSON.stringify(mapObj.map);
  localStorage.setItem("map", saveMap);
}

// Function to load map from local storage
function load() {
  const savedMap = localStorage.getItem("map");
  if (savedMap) {
    mapObj.map = JSON.parse(savedMap);
    renderTable();
  }
}

// Function to handle next button click
function next() {
  if (visibleStartIndex + 40 < cols) {
    visibleStartIndex += 5;
    renderTable();
  }
}

// Function to handle previous button click
function prev() {
  if (visibleStartIndex > 0) {
    visibleStartIndex -= 5;
    renderTable();
  }
}

// Function to render the table
function renderTable() {
  tableEl.innerHTML = ""; // Clear existing table

  for (let row = 0; row < mapObj.map.length; row++) {
    const tableRow = document.createElement("tr");

    for (
      let column = visibleStartIndex;
      column < visibleStartIndex + 40;
      column++
    ) {
      const tableColumn = document.createElement("td");
      tableColumn.className = `cell ${row} ${column}`;

      tableColumn.addEventListener("mousedown", () => {
        isMouseDown = true;
        addTile(row, column, tableColumn);
      });

      tableColumn.addEventListener("mouseup", () => {
        isMouseDown = false;
      });

      tableColumn.addEventListener("mouseover", () => {
        if (isMouseDown) addTile(row, column, tableColumn);
      });

      // Add image if the map value is not zero
      if (mapObj.map[row][column] !== 0) {
        const image = new Image();
        image.src = images[getTileKey(mapObj.map[row][column]) as ImageKey];
        tableColumn.appendChild(image);
      }

      tableRow.appendChild(tableColumn);
    }
    tableEl.appendChild(tableRow);
  }
}

// Function to add tile to the map
function addTile(row: number, column: number, tableColumn: HTMLElement) {
  if (!selectedTile) return;

  const image = new Image();
  image.src = images[selectedTile];
  const value = getTileValue(selectedTile);

  mapObj.map[row][column] = value;
  if (!tableColumn.firstChild) {
    tableColumn.appendChild(image);
  } else {
    (tableColumn.firstChild as HTMLImageElement).src = image.src;
  }
}

// Function to get tile key from value
function getTileKey(value: number): ImageKey | null {
  switch (value) {
    case 1:
      return "wall";
    case 2:
      return "grapes";
    case 3:
      return "banana";
    case 4:
      return "singleFire";
    case 5:
      return "corona";
    case 6:
      return "flag";
    case 7:
      return "animal";
    default:
      return null;
  }
}

// Function to get tile value from key
function getTileValue(key: ImageKey): number {
  switch (key) {
    case "wall":
      return 1;
    case "grapes":
      return 2;
    case "banana":
      return 3;
    case "singleFire":
      return 4;
    case "corona":
      return 5;
    case "flag":
      return 6;
    case "animal":
      return 7;
    default:
      return 0;
  }
}

// Create UI elements dynamically
function createUI() {
  const controlsDiv = document.createElement("div");

  // Create image buttons
  (Object.keys(images) as ImageKey[]).forEach((key) => {
    const img = document.createElement("img");
    img.src = images[key];
    img.onclick = () => selectTile(key);
    controlsDiv.appendChild(img);
  });

  // Create save button
  const saveButton = document.createElement("button");
  saveButton.innerText = "Save";
  saveButton.onclick = save;
  controlsDiv.appendChild(saveButton);

  // Create next button
  const nextButton = document.createElement("button");
  nextButton.innerText = "Next";
  nextButton.onclick = next;
  controlsDiv.appendChild(nextButton);

  // Create previous button
  const prevButton = document.createElement("button");
  prevButton.innerText = "Prev";
  prevButton.onclick = prev;
  controlsDiv.appendChild(prevButton);

  document.body.appendChild(controlsDiv);
}

// Load saved map if exists and render table
load();
renderTable();
createUI();
