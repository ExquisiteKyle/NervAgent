// Game State Management
import {
  VILLAGE_CENTER_X,
  VILLAGE_CENTER_Y,
  ItemType,
  QUESTS
} from './gameConstants.js';

// Initialize game state
export let gameState = {
  playerPos: { x: VILLAGE_CENTER_X, y: VILLAGE_CENTER_Y + 300 },  // Start at village entrance (south)
  playerStats: {
    hp: 100,
    maxHP: 100,
    attack: 10,
    defense: 5
  },
  inventory: [],
  quests: [],
  currentQuest: QUESTS.MOVEMENT.id,
  questsCompleted: [],
  playerMoved: false,
  hestia: {
    pos: { x: VILLAGE_CENTER_X, y: VILLAGE_CENTER_Y + 250 },  // Near player at entrance
    hasMessage: true,
    followDistance: 60,
    currentMessage: null
  },
  abilities: {
    canInteract: false,
    canCollect: false,
    canOpenChest: false,
    canFight: false
  },
  npcs: [
    // NPCs around the central plaza
    { id: 'npc1', pos: { x: VILLAGE_CENTER_X - 150, y: VILLAGE_CENTER_Y - 50 }, type: 'npc', talked: false },
    { id: 'merchant', pos: { x: VILLAGE_CENTER_X - 400, y: VILLAGE_CENTER_Y }, type: 'merchant', talked: false },  // Shop area (west)
    { id: 'quest_giver', pos: { x: VILLAGE_CENTER_X, y: VILLAGE_CENTER_Y - 200 }, type: 'quest_giver', talked: false }  // North of plaza
  ],
  items: [
    // Items in their respective rooms
    { id: 'potion1', pos: { x: VILLAGE_CENTER_X - 200, y: VILLAGE_CENTER_Y - 200 }, type: ItemType.POTION, collected: false },  // House 1 (northwest)
    { id: 'key1', pos: { x: VILLAGE_CENTER_X + 200, y: VILLAGE_CENTER_Y - 200 }, type: ItemType.KEY, collected: false },  // House 2 (northeast)
    { id: 'sword1', pos: { x: VILLAGE_CENTER_X - 200, y: VILLAGE_CENTER_Y + 100 }, type: ItemType.SWORD, collected: false }
  ],
  chestPos: { x: VILLAGE_CENTER_X + 360, y: VILLAGE_CENTER_Y + 10 },  // Treasure building (east)
  chestOpened: false,
  chestRequiresKey: true,
  enemyPos: { x: VILLAGE_CENTER_X + 500, y: VILLAGE_CENTER_Y + 200 },  // Training ground (southeast)
  enemyHP: 100,
  enemyDefeated: false,
  highlightedArea: null
};

// Game state getters/setters
export const getGameState = () => {
  const { highlightedArea, ...state } = gameState;
  return state;
};

export const updateGameState = (newState) => {
  Object.assign(gameState, newState);
  console.log('Game state updated:', gameState);
};

