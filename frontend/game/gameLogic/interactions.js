// Interaction System
import { INTERACTION_DISTANCE, ItemType } from '../gameConstants.js';
import { gameState } from '../gameState.js';
import { showDialogue } from '../dialogue/dialogueBox.js';
import { showSpeechBubble } from '../dialogue/speechBubbles.js';
import { showObjectMessage } from '../dialogue/objectMessages.js';
import { updateInteractionPrompt } from '../ui/interactionPrompt.js';

export function findNearbyEntity(scene) {
  const playerX = gameState.playerPos.x;
  const playerY = gameState.playerPos.y;
  
  // Check Hestia first (priority)
  const hestiaDist = Phaser.Math.Distance.Between(
    playerX, playerY,
    gameState.hestia.pos.x, gameState.hestia.pos.y
  );
  if (hestiaDist <= INTERACTION_DISTANCE) {
    return { type: 'hestia' };
  }
  
  const npc = gameState.npcs.find(n => {
    if (n.talked) return false;
    const dist = Phaser.Math.Distance.Between(playerX, playerY, n.pos.x, n.pos.y);
    return dist <= INTERACTION_DISTANCE;
  });
  if (npc) return { type: 'npc', npc };
  
  // Check items - use sprite position
  const item = gameState.items.find(i => {
    if (i.collected) return false;
    const entityObj = scene.entityObjects[i.id];
    if (!entityObj || !entityObj.sprite) return false;
    
    const dist = Phaser.Math.Distance.Between(
      playerX, playerY,
      entityObj.sprite.x, entityObj.sprite.y
    );
    return dist <= INTERACTION_DISTANCE;
  });
  if (item) return { type: 'item', item };
  
  // Check chest - use sprite position
  if (scene.entityObjects.chest && scene.entityObjects.chest.sprite && !gameState.chestOpened) {
    const chestDist = Phaser.Math.Distance.Between(
      playerX, playerY,
      scene.entityObjects.chest.sprite.x, scene.entityObjects.chest.sprite.y
    );
    if (chestDist <= INTERACTION_DISTANCE) {
      return { type: 'chest' };
    }
  }
  
  // Check enemy - use sprite position
  if (scene.entityObjects.enemy && scene.entityObjects.enemy.sprite && !gameState.enemyDefeated) {
    const enemyDist = Phaser.Math.Distance.Between(
      playerX, playerY,
      scene.entityObjects.enemy.sprite.x, scene.entityObjects.enemy.sprite.y
    );
    if (enemyDist <= INTERACTION_DISTANCE) {
      return { type: 'enemy' };
    }
  }
  
  return null;
}

export function handleInteractions(scene, interactionKey, advanceDialogue, talkToHestia, talkToNPC, collectItem, openChest, attackEnemy) {
  if (!Phaser.Input.Keyboard.JustDown(interactionKey)) return;
  
  // If dialogue is active, advance it instead of interacting
  if (scene.isDialogueActive) {
    advanceDialogue(scene);
    return;
  }
  
  const nearbyEntity = findNearbyEntity(scene);
  if (!nearbyEntity) return;
  
  if (nearbyEntity.type === 'hestia') {
    talkToHestia(scene);
  } else if (nearbyEntity.type === 'npc') {
    talkToNPC(scene, nearbyEntity.npc);
  } else if (nearbyEntity.type === 'item') {
    collectItem(scene, nearbyEntity.item);
  } else if (nearbyEntity.type === 'chest') {
    openChest(scene);
  } else if (nearbyEntity.type === 'enemy') {
    attackEnemy(scene);
  }
  
  updateInteractionPrompt(scene, () => findNearbyEntity(scene));
}

export function talkToNPC(scene, npc, checkQuestCompletion) {
  // Check if player has learned to interact
  if (!gameState.abilities.canInteract) {
    showDialogue(scene, '???', 'Hestia hasn\'t taught you how to interact yet. Talk to her first by pressing E near her.', false);
    return;
  }
  
  npc.talked = true;
  
  let speechText = '';
  if (npc.type === 'merchant') {
    speechText = 'Welcome! I sell potions and equipment. Press I to see your inventory.';
  } else if (npc.type === 'quest_giver') {
    const quest = { id: 'quest1', title: 'Defeat the Enemy', completed: false };
    gameState.quests.push(quest);
    speechText = 'Defeat the enemy to complete your first quest!';
  } else {
    speechText = 'Welcome, adventurer! Explore and gather items to become stronger.';
  }
  
  showSpeechBubble(scene, npc.id, npc.pos.x, npc.pos.y, speechText, 4000);
  updateInteractionPrompt(scene, () => findNearbyEntity(scene));
  checkQuestCompletion();
  
  // Proactive agent notification
  if (typeof window.notifyGameEvent === 'function') {
    window.notifyGameEvent('NPC_TALKED', { 
      npcType: npc.type,
      npcsTalked: gameState.npcs.filter(n => n.talked).length,
      canCollect: gameState.abilities.canCollect
    });
  }
}

