// Asset Loading
export function preloadAssets(scene) {
  // Fantasy Battle Pack sprites - all 32x32 frame size
  const FRAME_SIZE = 32;
  
  // Player sprite (SwordFighter)
  scene.load.spritesheet('player', '/assets/fantasy-battle/Sprite Sheets/SwordFighter/SwordFighter_LongHair_Blue1.png', {
    frameWidth: FRAME_SIZE,
    frameHeight: FRAME_SIZE
  });
  
  // NPCs
  scene.load.spritesheet('npc_knight', '/assets/fantasy-battle/Sprite Sheets/LanceKnight/LanceKnight_Blue.png', {
    frameWidth: FRAME_SIZE,
    frameHeight: FRAME_SIZE
  });
  
  scene.load.spritesheet('npc_merchant', '/assets/fantasy-battle/Sprite Sheets/Thief/Thief_Green1.png', {
    frameWidth: FRAME_SIZE,
    frameHeight: FRAME_SIZE
  });
  
  scene.load.spritesheet('npc_wizard', '/assets/fantasy-battle/Sprite Sheets/Wizard/Wizard_Red1.png', {
    frameWidth: FRAME_SIZE,
    frameHeight: FRAME_SIZE
  });
  
  // Enemy (using red Axe Fighter as enemy)
  scene.load.spritesheet('enemy', '/assets/fantasy-battle/Sprite Sheets/AxeFighter/AxeFighter_ShortHair_Red1.png', {
    frameWidth: FRAME_SIZE,
    frameHeight: FRAME_SIZE
  });
  
  // Note: Tilemap loading removed - using graphics-based map rendering instead
  // If you want to use a Tiled map in the future, uncomment these lines and create the map file:
  // scene.load.image('tileset', '/assets/fantasy-battle/Tiles/FullTileset.png');
  // scene.load.tilemapTiledJSON('villageMap', '/assets/maps/village.json');
  
  // Items will use generated graphics shapes instead of sprites
}

