// Game Constants and Configuration
export const CANVAS_WIDTH = window.innerWidth * 0.5;
export const CANVAS_HEIGHT = window.innerHeight * 0.5;

// Village layout constants - centered in world
export const VILLAGE_SIZE = 1200;
export const VILLAGE_CENTER_X = 0;  // Center at origin
export const VILLAGE_CENTER_Y = 0;  // Center at origin

// World size matches village size (with padding for boundaries)
export const WORLD_WIDTH = VILLAGE_SIZE + 100;
export const WORLD_HEIGHT = VILLAGE_SIZE + 100;

// Game mechanics constants
export const PLAYER_SPEED = 150;
export const ENTITY_SIZE = 32;
export const INTERACTION_DISTANCE = 40;

// Item types
export const ItemType = {
  POTION: 'potion',
  KEY: 'key',
  SWORD: 'sword',
  SHIELD: 'shield'
};

// Color palette
export const Colors = {
  BACKGROUND: 0x34495e,
  PLAYER: 0x3498db,
  NPC: 0x27ae60,
  MERCHANT: 0x9b59b6,
  QUEST_GIVER: 0x1abc9c,
  CHEST: 0xf39c12,
  ITEM: 0xe67e22,
  ENEMY: 0xe74c3c,
  HIGHLIGHT: 0xf39c12,
  VILLAGE_GROUND: 0x5a8a4a, // Green grass color
  BUILDING: 0x8b6f47,
  BUILDING_ROOF: 0x654321,
  PATH: 0x5a4a3a, // Brown/dirt path
  PLAZA: 0x6b6b6b // Gray stone/concrete plaza
};

// Quest definitions
export const QUESTS = {
  MOVEMENT: { id: 'movement', name: 'Master Movement', description: 'Move around to explore the area', completed: false },
  TALK_NPC: { id: 'talk_npc', name: 'Talk to NPCs', description: 'Interact with any NPC', completed: false },
  COLLECT_ITEMS: { id: 'collect_items', name: 'Collect Items', description: 'Find and collect any item', completed: false },
  OPEN_CHEST: { id: 'open_chest', name: 'Open the Chest', description: 'Use your key to open the treasure chest', completed: false },
  DEFEAT_ENEMY: { id: 'defeat_enemy', name: 'Defeat the Enemy', description: 'Defeat the training dummy in combat', completed: false }
};

// Village boundaries
export const VILLAGE_MIN_X = VILLAGE_CENTER_X - VILLAGE_SIZE / 2;
export const VILLAGE_MAX_X = VILLAGE_CENTER_X + VILLAGE_SIZE / 2;
export const VILLAGE_MIN_Y = VILLAGE_CENTER_Y - VILLAGE_SIZE / 2;
export const VILLAGE_MAX_Y = VILLAGE_CENTER_Y + VILLAGE_SIZE / 2;

