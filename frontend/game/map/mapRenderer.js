// Map Rendering
import {
  VILLAGE_SIZE,
  VILLAGE_CENTER_X,
  VILLAGE_CENTER_Y,
  VILLAGE_MIN_X,
  VILLAGE_MAX_X,
  VILLAGE_MIN_Y,
  VILLAGE_MAX_Y,
  Colors
} from '../gameConstants.js';

export function createBackground(scene) {
  // Try to load tilemap from Tiled, fallback to graphics if not available
  // Check if tilemap was loaded successfully
  if (scene.cache.tilemap.exists('villageMap')) {
    try {
      const map = scene.make.tilemap({ key: 'villageMap' });
      
      // Get the tileset - the name should match what you set in Tiled
      let tileset = map.getTileset('FullTileset');
      if (!tileset && map.tilesets && map.tilesets.length > 0) {
        tileset = map.tilesets[0]; // Use first tileset if name doesn't match
      }
      
      if (tileset) {
        // Add the tileset image
        const tilesetImage = map.addTilesetImage(tileset.name, 'tileset');
        
        // Create layers from the tilemap (layer names must match what you created in Tiled)
        const groundLayer = map.createLayer('Ground', tilesetImage, VILLAGE_MIN_X, VILLAGE_MIN_Y);
        const pathLayer = map.createLayer('Paths', tilesetImage, VILLAGE_MIN_X, VILLAGE_MIN_Y);
        const buildingLayer = map.createLayer('Buildings', tilesetImage, VILLAGE_MIN_X, VILLAGE_MIN_Y);
        
        // Set layer depths
        if (groundLayer) groundLayer.setDepth(0);
        if (pathLayer) pathLayer.setDepth(1);
        if (buildingLayer) buildingLayer.setDepth(2);
        
        // Store map reference
        scene.tilemap = map;
        
        // Still add boundary walls
        createBoundaryWalls(scene);
        
        console.log('Tilemap loaded successfully!');
        return; // Successfully loaded tilemap
      }
    } catch (error) {
      console.log('Error loading tilemap, using fallback graphics:', error);
    }
  } else {
    console.log('Tilemap file not found, using fallback graphics. See TILED_MAP_SETUP.md for instructions.');
  }
  
  // Fallback: Enhanced graphics-based map with more visual detail
  createGraphicsMap(scene);
}

function createBoundaryWalls(scene) {
  const wallGraphics = scene.add.graphics();
  wallGraphics.fillStyle(0x2c3e50, 1);
  const wallThickness = 40;
  
  wallGraphics.fillRect(VILLAGE_MIN_X - wallThickness, VILLAGE_MIN_Y - wallThickness, VILLAGE_SIZE + wallThickness * 2, wallThickness);
  wallGraphics.fillRect(VILLAGE_MIN_X - wallThickness, VILLAGE_MAX_Y, VILLAGE_SIZE + wallThickness * 2, wallThickness);
  wallGraphics.fillRect(VILLAGE_MIN_X - wallThickness, VILLAGE_MIN_Y - wallThickness, wallThickness, VILLAGE_SIZE + wallThickness * 2);
  wallGraphics.fillRect(VILLAGE_MAX_X, VILLAGE_MIN_Y - wallThickness, wallThickness, VILLAGE_SIZE + wallThickness * 2);
  
  wallGraphics.lineStyle(4, 0x1a252f, 1);
  wallGraphics.strokeRect(VILLAGE_MIN_X - wallThickness, VILLAGE_MIN_Y - wallThickness, VILLAGE_SIZE + wallThickness * 2, VILLAGE_SIZE + wallThickness * 2);
}

function createGraphicsMap(scene) {
  scene.add.rectangle(0, 0, VILLAGE_SIZE, VILLAGE_SIZE, Colors.BACKGROUND);
  
  const groundGraphics = scene.add.graphics();
  
  // Create grass ground pattern with variation
  const tileSize = 32;
  for (let y = VILLAGE_MIN_Y; y < VILLAGE_MAX_Y; y += tileSize) {
    for (let x = VILLAGE_MIN_X; x < VILLAGE_MAX_X; x += tileSize) {
      // Alternate between slightly different green shades for a checkerboard-like grass pattern
      const isEven = ((x - VILLAGE_MIN_X) / tileSize + (y - VILLAGE_MIN_Y) / tileSize) % 2 === 0;
      const shade = isEven ? Colors.VILLAGE_GROUND : 0x6a9a5a; // Slightly lighter green shade
      groundGraphics.fillStyle(shade, 1);
      groundGraphics.fillRect(x, y, tileSize, tileSize);
    }
  }
  
  // Add subtle texture lines for grid pattern (darker green)
  groundGraphics.lineStyle(1, 0x4a6a3a, 0.15);
  for (let x = VILLAGE_MIN_X; x <= VILLAGE_MAX_X; x += tileSize) {
    groundGraphics.moveTo(x, VILLAGE_MIN_Y);
    groundGraphics.lineTo(x, VILLAGE_MAX_Y);
  }
  for (let y = VILLAGE_MIN_Y; y <= VILLAGE_MAX_Y; y += tileSize) {
    groundGraphics.moveTo(VILLAGE_MIN_X, y);
    groundGraphics.lineTo(VILLAGE_MAX_X, y);
  }
  groundGraphics.strokePath();
  
  // Add random decorative patches for visual variety (darker grass patches)
  groundGraphics.fillStyle(0x4a7a3a, 0.2);
  const patchCount = 15;
  for (let i = 0; i < patchCount; i++) {
    const patchX = VILLAGE_MIN_X + Math.random() * VILLAGE_SIZE;
    const patchY = VILLAGE_MIN_Y + Math.random() * VILLAGE_SIZE;
    const patchSize = 20 + Math.random() * 30;
    groundGraphics.fillCircle(patchX, patchY, patchSize);
  }
  
  // Enhanced walls with decorative elements
  createBoundaryWalls(scene);
  
  // Enhanced plaza with decorative pattern
  createPlaza(scene);
  
  // Enhanced paths with borders and depth - properly connected
  createPaths(scene);
  
  // Enhanced buildings with more detail
  createBuildings(scene);
  
  // Enhanced decorative elements around the map
  createDecorations(scene);
}

function createPlaza(scene) {
  const plazaSize = 200;
  const plazaGraphics = scene.add.graphics();
  
  // Plaza base
  plazaGraphics.fillStyle(Colors.PLAZA, 1);
  plazaGraphics.fillRect(VILLAGE_CENTER_X - plazaSize / 2, VILLAGE_CENTER_Y - plazaSize / 2, plazaSize, plazaSize);
  
  // Add stone pattern to plaza
  plazaGraphics.fillStyle(0x5a7a9a, 0.3);
  const stoneSize = 20;
  for (let y = VILLAGE_CENTER_Y - plazaSize / 2; y < VILLAGE_CENTER_Y + plazaSize / 2; y += stoneSize) {
    for (let x = VILLAGE_CENTER_X - plazaSize / 2; x < VILLAGE_CENTER_X + plazaSize / 2; x += stoneSize) {
      if ((x + y) % (stoneSize * 2) === 0) {
        plazaGraphics.fillRect(x, y, stoneSize, stoneSize);
      }
    }
  }
  
  // Plaza border
  plazaGraphics.lineStyle(3, 0x2c3e50, 1);
  plazaGraphics.strokeRect(VILLAGE_CENTER_X - plazaSize / 2, VILLAGE_CENTER_Y - plazaSize / 2, plazaSize, plazaSize);
  
  // Plaza center decoration
  plazaGraphics.fillStyle(0x4a6a8a, 0.5);
  plazaGraphics.fillCircle(VILLAGE_CENTER_X, VILLAGE_CENTER_Y, 30);
  plazaGraphics.lineStyle(2, 0x2c3e50, 1);
  plazaGraphics.strokeCircle(VILLAGE_CENTER_X, VILLAGE_CENTER_Y, 30);
}

function createPaths(scene) {
  const pathGraphics = scene.add.graphics();
  const pathWidth = 60;
  const pathHalf = pathWidth / 2;
  const pathBorderColor = 0x3a2a1a;
  
  // Helper to draw path segment with border
  const drawPathSegment = (x, y, width, height, isHorizontal) => {
    // Path shadow
    pathGraphics.fillStyle(0x1a1a1a, 0.3);
    pathGraphics.fillRect(x + 2, y + 2, width, height);
    
    // Path border (darker)
    pathGraphics.fillStyle(pathBorderColor, 1);
    pathGraphics.fillRect(x - 2, y - 2, width + 4, height + 4);
    
    // Path surface
    pathGraphics.fillStyle(Colors.PATH, 1);
    pathGraphics.fillRect(x, y, width, height);
    
    // Path center line (lighter)
    pathGraphics.fillStyle(0x6a5a4a, 0.4);
    if (isHorizontal) {
      pathGraphics.fillRect(x, y + height / 2 - 2, width, 4);
    } else {
      pathGraphics.fillRect(x + width / 2 - 2, y, 4, height);
    }
    
    // Path edge highlights
    pathGraphics.lineStyle(1, 0x7a6a5a, 0.3);
    if (isHorizontal) {
      pathGraphics.moveTo(x, y);
      pathGraphics.lineTo(x + width, y);
      pathGraphics.moveTo(x, y + height);
      pathGraphics.lineTo(x + width, y + height);
    } else {
      pathGraphics.moveTo(x, y);
      pathGraphics.lineTo(x, y + height);
      pathGraphics.moveTo(x + width, y);
      pathGraphics.lineTo(x + width, y + height);
    }
    pathGraphics.strokePath();
  };
  
  // Draw paths as connected network, starting from plaza center
  const plazaCenterX = VILLAGE_CENTER_X;
  const plazaCenterY = VILLAGE_CENTER_Y;
  
  // First, draw the intersection at plaza center to connect all paths
  const intersectionSize = pathWidth + 4;
  pathGraphics.fillStyle(0x1a1a1a, 0.3); // Shadow
  pathGraphics.fillRect(plazaCenterX - intersectionSize / 2 + 2, plazaCenterY - intersectionSize / 2 + 2, intersectionSize, intersectionSize);
  pathGraphics.fillStyle(pathBorderColor, 1); // Border
  pathGraphics.fillRect(plazaCenterX - intersectionSize / 2, plazaCenterY - intersectionSize / 2, intersectionSize, intersectionSize);
  pathGraphics.fillStyle(Colors.PATH, 1); // Surface
  pathGraphics.fillRect(plazaCenterX - pathHalf, plazaCenterY - pathHalf, pathWidth, pathWidth);
  
  // Main path from south to plaza (vertical, bottom to center)
  drawPathSegment(plazaCenterX - pathHalf, plazaCenterY + 100, pathWidth, 300, false);
  
  // Path from plaza to west (horizontal, center to left)
  drawPathSegment(plazaCenterX - 400, plazaCenterY - pathHalf, 400, pathWidth, true);
  
  // Path from plaza to east (horizontal, center to right)
  drawPathSegment(plazaCenterX + 100, plazaCenterY - pathHalf, 250, pathWidth, true);
  
  // Path from plaza to north (vertical, center to top)
  drawPathSegment(plazaCenterX - pathHalf, plazaCenterY - 200, pathWidth, 200, false);
  
  // Path to training ground (horizontal, southeast) - connects to south path
  const southPathY = plazaCenterY + 100;
  const trainingPathY = southPathY + 100; // Where it branches from south path
  const trainingPathX = plazaCenterX + 200;
  
  // Draw the connecting intersection where training path meets south path
  pathGraphics.fillStyle(0x1a1a1a, 0.3);
  pathGraphics.fillRect(plazaCenterX - intersectionSize / 2 + 2, trainingPathY - pathHalf + 2, pathWidth + 4, pathWidth + 4);
  pathGraphics.fillStyle(pathBorderColor, 1);
  pathGraphics.fillRect(plazaCenterX - intersectionSize / 2, trainingPathY - pathHalf, pathWidth + 4, pathWidth + 4);
  pathGraphics.fillStyle(Colors.PATH, 1);
  pathGraphics.fillRect(plazaCenterX - pathHalf, trainingPathY - pathHalf, pathWidth, pathWidth);
  
  // Now draw the training path
  drawPathSegment(trainingPathX, trainingPathY - pathHalf, 300, pathWidth, true);
  
  // Add center marks for intersections
  pathGraphics.fillStyle(0x6a5a4a, 0.4);
  // Plaza intersection
  pathGraphics.fillRect(plazaCenterX - 2, plazaCenterY - pathHalf, 4, pathWidth);
  pathGraphics.fillRect(plazaCenterX - pathHalf, plazaCenterY - 2, pathWidth, 4);
  // Training path intersection
  pathGraphics.fillRect(plazaCenterX - 2, trainingPathY - pathHalf, 4, pathWidth);
  pathGraphics.fillRect(plazaCenterX - pathHalf, trainingPathY - 2, pathWidth, 4);
}

function createBuildings(scene) {
  const buildingGraphics = scene.add.graphics();
  
  // Helper function to draw building with details
  const drawBuilding = (x, y, width, height, roofHeight = 30) => {
    // Building shadow
    buildingGraphics.fillStyle(0x1a1a1a, 0.3);
    buildingGraphics.fillRect(x + 4, y + 4, width, height);
    
    // Building base
    buildingGraphics.fillStyle(Colors.BUILDING, 1);
    buildingGraphics.fillRect(x, y, width, height);
    
    // Building border
    buildingGraphics.lineStyle(2, 0x654321, 1);
    buildingGraphics.strokeRect(x, y, width, height);
    
    // Door only (no windows)
    buildingGraphics.fillStyle(0x3a2a1a, 1);
    buildingGraphics.fillRect(x + width / 2 - 8, y + height - 20, 16, 20);
    
    // Roof
    buildingGraphics.fillStyle(Colors.BUILDING_ROOF, 1);
    buildingGraphics.fillRect(x - 10, y - roofHeight, width + 20, roofHeight);
    buildingGraphics.lineStyle(2, 0x543210, 1);
    buildingGraphics.strokeRect(x - 10, y - roofHeight, width + 20, roofHeight);
    
    // Roof detail lines
    buildingGraphics.lineStyle(1, 0x432100, 0.5);
    for (let i = 0; i < 3; i++) {
      const offset = (width + 20) / 4 * (i + 1);
      buildingGraphics.moveTo(x - 10 + offset, y - roofHeight);
      buildingGraphics.lineTo(x - 10 + offset, y);
    }
    buildingGraphics.strokePath();
  };
  
  // Merchant shop (west)
  drawBuilding(VILLAGE_CENTER_X - 500, VILLAGE_CENTER_Y - 60, 120, 120, 30);
  
  // Treasure building (east)
  drawBuilding(VILLAGE_CENTER_X + 300, VILLAGE_CENTER_Y - 60, 120, 120, 30);
  
  // House 1 (northwest)
  drawBuilding(VILLAGE_CENTER_X - 250, VILLAGE_CENTER_Y - 250, 100, 100, 25);
  
  // House 2 (northeast)
  drawBuilding(VILLAGE_CENTER_X + 150, VILLAGE_CENTER_Y - 250, 100, 100, 25);
  
  // Training arena (southeast) - enhanced circular area
  const arenaX = VILLAGE_CENTER_X + 500;
  const arenaY = VILLAGE_CENTER_Y + 200;
  const arenaRadius = 100;
  
  // Arena shadow
  buildingGraphics.fillStyle(0x1a1a1a, 0.4);
  buildingGraphics.fillCircle(arenaX + 3, arenaY + 3, arenaRadius);
  
  // Arena base
  buildingGraphics.fillStyle(0x5a4a3a, 0.7);
  buildingGraphics.fillCircle(arenaX, arenaY, arenaRadius);
  
  // Arena border
  buildingGraphics.lineStyle(4, 0x8b6f47, 1);
  buildingGraphics.strokeCircle(arenaX, arenaY, arenaRadius);
  
  // Arena inner circle
  buildingGraphics.lineStyle(2, 0x6a5a3a, 0.6);
  buildingGraphics.strokeCircle(arenaX, arenaY, arenaRadius - 20);
  
  // Arena center mark
  buildingGraphics.fillStyle(0x4a3a2a, 1);
  buildingGraphics.fillCircle(arenaX, arenaY, 8);
}

function createDecorations(scene) {
  const decorGraphics = scene.add.graphics();
  
  // Helper to draw a simple tree
  const drawTree = (x, y, size = 12) => {
    // Tree trunk
    decorGraphics.fillStyle(0x4a2a1a, 1);
    decorGraphics.fillRect(x - 2, y + size - 4, 4, size);
    // Tree foliage (top)
    decorGraphics.fillStyle(0x2d5016, 1);
    decorGraphics.fillCircle(x, y, size);
    decorGraphics.fillStyle(0x1a3009, 0.6);
    decorGraphics.fillCircle(x - 2, y - 2, size * 0.7);
    decorGraphics.fillCircle(x + 2, y - 2, size * 0.7);
  };
  
  // Helper to draw a rock cluster
  const drawRock = (x, y) => {
    decorGraphics.fillStyle(0x6a6a6a, 0.8);
    decorGraphics.fillCircle(x, y, 8);
    decorGraphics.fillStyle(0x555555, 0.6);
    decorGraphics.fillCircle(x + 5, y + 3, 6);
    decorGraphics.fillCircle(x - 3, y + 5, 7);
    decorGraphics.fillStyle(0x444444, 0.4);
    decorGraphics.fillCircle(x - 2, y - 2, 4);
  };
  
  // Helper to check if position is on grass (not on paths or plaza)
  const isOnGrass = (x, y) => {
    const plazaSize = 200;
    const plazaMinX = VILLAGE_CENTER_X - plazaSize / 2;
    const plazaMaxX = VILLAGE_CENTER_X + plazaSize / 2;
    const plazaMinY = VILLAGE_CENTER_Y - plazaSize / 2;
    const plazaMaxY = VILLAGE_CENTER_Y + plazaSize / 2;
    
    // Check if in plaza
    if (x >= plazaMinX && x <= plazaMaxX && y >= plazaMinY && y <= plazaMaxY) {
      return false;
    }
    
    // Check if on paths
    const pathWidth = 60;
    const pathHalf = pathWidth / 2;
    
    // Main path from south to plaza
    if (x >= VILLAGE_CENTER_X - pathHalf && x <= VILLAGE_CENTER_X + pathHalf &&
        y >= VILLAGE_CENTER_Y + 100 && y <= VILLAGE_CENTER_Y + 400) {
      return false;
    }
    // Path from plaza to west
    if (x >= VILLAGE_CENTER_X - 400 && x <= VILLAGE_CENTER_X &&
        y >= VILLAGE_CENTER_Y - pathHalf && y <= VILLAGE_CENTER_Y + pathHalf) {
      return false;
    }
    // Path from plaza to east
    if (x >= VILLAGE_CENTER_X + 100 && x <= VILLAGE_CENTER_X + 350 &&
        y >= VILLAGE_CENTER_Y - pathHalf && y <= VILLAGE_CENTER_Y + pathHalf) {
      return false;
    }
    // Path from plaza to north
    if (x >= VILLAGE_CENTER_X - pathHalf && x <= VILLAGE_CENTER_X + pathHalf &&
        y >= VILLAGE_CENTER_Y - 200 && y <= VILLAGE_CENTER_Y) {
      return false;
    }
    // Path to training ground
    if (x >= VILLAGE_CENTER_X + 200 && x <= VILLAGE_CENTER_X + 500 &&
        y >= VILLAGE_CENTER_Y + 100 && y <= VILLAGE_CENTER_Y + 100 + pathWidth) {
      return false;
    }
    
    return true; // On grass
  };
  
  // Decorative elements scattered around (trees only on grass)
  const decorPositions = [
    { x: VILLAGE_CENTER_X - 300, y: VILLAGE_CENTER_Y + 150, type: 'tree' },
    { x: VILLAGE_CENTER_X + 250, y: VILLAGE_CENTER_Y - 100, type: 'rock' },
    { x: VILLAGE_CENTER_X - 100, y: VILLAGE_CENTER_Y + 250, type: 'tree' },
    { x: VILLAGE_CENTER_X + 400, y: VILLAGE_CENTER_Y + 50, type: 'rock' },
    { x: VILLAGE_CENTER_X - 450, y: VILLAGE_CENTER_Y + 200, type: 'tree' },
    { x: VILLAGE_CENTER_X + 350, y: VILLAGE_CENTER_Y + 250, type: 'tree' },
    { x: VILLAGE_CENTER_X - 200, y: VILLAGE_CENTER_Y - 150, type: 'rock' },
    { x: VILLAGE_CENTER_X + 200, y: VILLAGE_CENTER_Y - 300, type: 'tree' },
    { x: VILLAGE_CENTER_X - 350, y: VILLAGE_CENTER_Y - 200, type: 'rock' },
    { x: VILLAGE_CENTER_X + 450, y: VILLAGE_CENTER_Y - 150, type: 'tree' },
    { x: VILLAGE_CENTER_X - 150, y: VILLAGE_CENTER_Y + 300, type: 'rock' },
    { x: VILLAGE_CENTER_X + 100, y: VILLAGE_CENTER_Y + 300, type: 'tree' },
  ];
  
  decorPositions.forEach(pos => {
    if (pos.type === 'tree') {
      // Only draw trees on grass (not on paths or plaza)
      if (isOnGrass(pos.x, pos.y)) {
        drawTree(pos.x, pos.y);
      }
    } else if (pos.type === 'rock') {
      // Rocks can be anywhere
      drawRock(pos.x, pos.y);
    }
  });
  
  // Add small decorative flowers/patches near paths
  decorGraphics.fillStyle(0x8b6f47, 0.4);
  const flowerPositions = [
    { x: VILLAGE_CENTER_X - 100, y: VILLAGE_CENTER_Y + 50 },
    { x: VILLAGE_CENTER_X + 150, y: VILLAGE_CENTER_Y - 50 },
    { x: VILLAGE_CENTER_X - 200, y: VILLAGE_CENTER_Y - 100 },
    { x: VILLAGE_CENTER_X + 300, y: VILLAGE_CENTER_Y + 100 },
  ];
  flowerPositions.forEach(pos => {
    decorGraphics.fillCircle(pos.x, pos.y, 6);
    decorGraphics.fillCircle(pos.x + 4, pos.y, 5);
    decorGraphics.fillCircle(pos.x - 4, pos.y, 5);
  });
}

