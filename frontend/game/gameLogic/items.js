// Item Management
import { ItemType } from '../gameConstants.js';
import { gameState } from '../gameState.js';
import { showDialogue } from '../dialogue/dialogueBox.js';
import { showObjectMessage } from '../dialogue/objectMessages.js';
import { updateInventoryUI } from '../ui/inventory.js';
import { updateHealthBar } from '../ui/healthBar.js';
import { updateInteractionPrompt } from '../ui/interactionPrompt.js';
import { findNearbyEntity } from './interactions.js';
import { t } from '../utils/i18n.js';

export function collectItem(scene, item, checkQuestCompletion) {
  // Check if player has learned to collect
  if (!gameState.abilities.canCollect) {
    showDialogue(scene, t('dialogue.unknownSpeaker'), t('abilities.notLearnedCollect'), false);
    return;
  }
  
  // Find first available slot (1, 2, 3, or 4)
  const maxSlots = 4;
  if (gameState.inventory.length >= maxSlots) {
    showObjectMessage(scene, gameState.playerPos.x, gameState.playerPos.y, t('items.inventoryFull'));
    return;
  }
  
  // Place item in the next available slot (slot numbers 1-4, array indices 0-3)
  item.collected = true;
  gameState.inventory.push(item); // This automatically places it in the next slot (slot number = inventory.length)
  
  if (scene.entityObjects[item.id]) {
    scene.entityObjects[item.id].sprite.setVisible(false);
  }
  
  let messageText = '';
  const itemType = item.type === ItemType.SWORD ? t('items.sword') :
                   item.type === ItemType.SHIELD ? t('items.shield') :
                   item.type === ItemType.POTION ? t('items.potion') :
                   item.type === ItemType.KEY ? t('items.key') : item.type;
  
  if (item.type === ItemType.SWORD) {
    gameState.playerStats.attack += 5;
    messageText = t('items.collectedSword', { itemType });
  } else if (item.type === ItemType.SHIELD) {
    gameState.playerStats.defense += 3;
    messageText = t('items.collectedShield', { itemType });
  } else {
    messageText = t('items.collected', { itemType });
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
    showMessage(t('items.noPotions'));
    return;
  }
  
  gameState.inventory.splice(potionIndex, 1);
  const healAmount = 30;
  gameState.playerStats.hp = Math.min(
    gameState.playerStats.maxHP,
    gameState.playerStats.hp + healAmount
  );
  showMessage(t('items.usedPotion', { amount: healAmount }));
  updateUI(scene);
}

export function showInventory(scene, showMessage) {
  if (gameState.inventory.length === 0) {
    showMessage(t('items.inventoryEmpty'));
    return;
  }
  
  const items = gameState.inventory.map(item => {
    if (item.type === ItemType.POTION) return t('items.potion');
    if (item.type === ItemType.KEY) return t('items.key');
    if (item.type === ItemType.SWORD) return t('items.sword');
    return item.type;
  }).join(', ');
  showMessage(t('items.inventory', { items }));
}

