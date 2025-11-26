// Item Management
import { ItemType } from '../gameConstants.js';
import { gameState } from '../gameState.js';
import { showDialogue } from '../dialogue/dialogueBox.js';
import { showObjectMessage } from '../dialogue/objectMessages.js';
import { updateInventoryUI } from '../ui/inventory.js';
import { updateHealthBar } from '../ui/healthBar.js';
import { updateInteractionPrompt } from '../ui/interactionPrompt.js';
import { findNearbyEntity } from './interactions.js';

export function collectItem(scene, item, checkQuestCompletion) {
  // Check if player has learned to collect
  if (!gameState.abilities.canCollect) {
    showDialogue(scene, '???', 'Hestia hasn\'t taught you how to collect items yet. Talk to her first by pressing E near her.', false);
    return;
  }
  
  // Find first available slot (1, 2, 3, or 4)
  const maxSlots = 4;
  if (gameState.inventory.length >= maxSlots) {
    showObjectMessage(scene, gameState.playerPos.x, gameState.playerPos.y, 'Inventory full!');
    return;
  }
  
  // Place item in the next available slot (slot numbers 1-4, array indices 0-3)
  item.collected = true;
  gameState.inventory.push(item); // This automatically places it in the next slot (slot number = inventory.length)
  
  if (scene.entityObjects[item.id]) {
    scene.entityObjects[item.id].sprite.setVisible(false);
  }
  
  let messageText = '';
  if (item.type === ItemType.SWORD) {
    gameState.playerStats.attack += 5;
    messageText = `You collected a ${item.type}!\nAttack +5`;
  } else if (item.type === ItemType.SHIELD) {
    gameState.playerStats.defense += 3;
    messageText = `You collected a ${item.type}!\nDefense +3`;
  } else {
    messageText = `You collected a ${item.type}!`;
  }
  
  showObjectMessage(scene, item.pos.x, item.pos.y, messageText);
  updateHealthBar(scene);
  updateInventoryUI(scene);
  updateInteractionPrompt(scene, () => findNearbyEntity(scene));
  checkQuestCompletion();
  
  // Proactive agent notification for strategic guidance
  if (typeof window.notifyGameEvent === 'function') {
    window.notifyGameEvent('ITEM_COLLECTED', { 
      type: item.type, 
      inventorySize: gameState.inventory.length,
      hasKey: gameState.inventory.some(i => i.type === ItemType.KEY),
      hasSword: gameState.inventory.some(i => i.type === ItemType.SWORD)
    });
  }
}

export function usePotion(scene, showMessage, updateUI) {
  const potionIndex = gameState.inventory.findIndex(item => item.type === ItemType.POTION);
  if (potionIndex === -1) {
    showMessage('No potions in inventory!');
    return;
  }
  
  gameState.inventory.splice(potionIndex, 1);
  const healAmount = 30;
  gameState.playerStats.hp = Math.min(
    gameState.playerStats.maxHP,
    gameState.playerStats.hp + healAmount
  );
  showMessage(`Used potion! Healed ${healAmount} HP`);
  updateUI(scene);
}

export function showInventory(scene, showMessage) {
  if (gameState.inventory.length === 0) {
    showMessage('Inventory is empty!');
    return;
  }
  
  const items = gameState.inventory.map(item => item.type).join(', ');
  showMessage(`Inventory: ${items}`);
}

