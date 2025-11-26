// Interaction Prompt UI
import { ENTITY_SIZE, ItemType } from '../gameConstants.js';
import { gameState } from '../gameState.js';

export function createInteractionPrompt(scene) {
  scene.interactionPrompt = scene.add.text(0, 0, '', {
    fontSize: '14px',
    color: '#ffffff',
    fontStyle: 'bold',
    backgroundColor: '#2c3e50',
    padding: { x: 8, y: 4 }
  }).setOrigin(0.5).setDepth(1000).setVisible(false);
  
  scene.speechBubbles = new Map();
  scene.objectMessage = null;
  scene.objectMessageDismissable = false;
  scene.objectMessageTimer = null;
  scene.objectMessageKeyListener = null;
}

export function updateInteractionPrompt(scene, findNearbyEntity) {
  const nearbyEntity = findNearbyEntity();
  
  if (!nearbyEntity) {
    scene.interactionPrompt.setVisible(false);
    return;
  }
  
  let promptText = '';
  let entityPos = { x: 0, y: 0 };
  
  if (nearbyEntity.type === 'hestia') {
    entityPos = gameState.hestia.pos;
    promptText = 'Press E to talk to Hestia';
  } else if (nearbyEntity.type === 'npc') {
    const npc = nearbyEntity.npc;
    entityPos = npc.pos;
    if (npc.type === 'merchant') {
      promptText = 'Press E to talk to Merchant';
    } else if (npc.type === 'quest_giver') {
      promptText = 'Press E to talk to Quest Giver';
    } else {
      promptText = 'Press E to talk to NPC';
    }
  } else if (nearbyEntity.type === 'item') {
    const item = nearbyEntity.item;
    entityPos = item.pos;
    const itemName = item.type === ItemType.POTION ? 'Potion' :
                    item.type === ItemType.KEY ? 'Key' :
                    item.type === ItemType.SWORD ? 'Sword' : 'Item';
    promptText = `Press E to collect ${itemName}`;
  } else if (nearbyEntity.type === 'chest') {
    entityPos = gameState.chestPos;
    promptText = 'Press E to open Chest';
  } else if (nearbyEntity.type === 'enemy') {
    entityPos = gameState.enemyPos;
    promptText = 'Press E to attack Enemy';
  }
  
  scene.interactionPrompt.setText(promptText);
  scene.interactionPrompt.setPosition(entityPos.x, entityPos.y - ENTITY_SIZE / 2 - 20);
  scene.interactionPrompt.setVisible(true);
}

