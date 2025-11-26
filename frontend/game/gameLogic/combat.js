// Combat System
import { ItemType } from '../gameConstants.js';
import { gameState } from '../gameState.js';
import { showDialogue } from '../dialogue/dialogueBox.js';
import { showObjectMessage } from '../dialogue/objectMessages.js';
import { updateInteractionPrompt } from '../ui/interactionPrompt.js';
import { findNearbyEntity } from './interactions.js';

export function openChest(scene, checkQuestCompletion, updateUI) {
  // Check if player has learned to open chests
  if (!gameState.abilities.canOpenChest) {
    showDialogue(scene, '???', 'Hestia hasn\'t taught you how to open chests yet. Talk to her first by pressing E near her.', false);
    return;
  }
  
  if (gameState.chestRequiresKey) {
    const hasKey = gameState.inventory.some(item => item.type === ItemType.KEY);
    if (!hasKey) {
      showObjectMessage(scene, gameState.chestPos.x, gameState.chestPos.y, 'Chest is locked!\nYou need a key.');
      return;
    }
    
    const keyIndex = gameState.inventory.findIndex(item => item.type === ItemType.KEY);
    gameState.inventory.splice(keyIndex, 1);
  }
  
  gameState.chestOpened = true;
  scene.chest.setVisible(false);
  
  const gold = 50;
  showObjectMessage(scene, gameState.chestPos.x, gameState.chestPos.y, `Chest opened!\nFound ${gold} gold!`);
  updateInteractionPrompt(scene, () => findNearbyEntity(scene));
  checkQuestCompletion();
  
  // Proactive agent notification
  if (typeof window.notifyGameEvent === 'function') {
    window.notifyGameEvent('CHEST_OPENED', { 
      hasSword: gameState.inventory.some(i => i.type === ItemType.SWORD),
      canFight: gameState.abilities.canFight
    });
  }
}

export function attackEnemy(scene, checkQuestCompletion, showMessage) {
  // Check if player has learned to fight
  if (!gameState.abilities.canFight) {
    showDialogue(scene, '???', 'Hestia hasn\'t taught you combat yet. Talk to her first by pressing E near her.', false);
    return;
  }
  
  const damage = gameState.playerStats.attack;
  gameState.enemyHP -= damage;
  
  const enemyDamage = Math.max(1, 10 - gameState.playerStats.defense);
  gameState.playerStats.hp -= enemyDamage;
  
  if (gameState.playerStats.hp <= 0) {
    gameState.playerStats.hp = 1;
    showMessage('You are defeated! HP restored to 1.');
  }
  
  if (gameState.enemyHP <= 0) {
    gameState.enemyDefeated = true;
    scene.enemy.setVisible(false);
    
    const quest = gameState.quests.find(q => q.id === 'quest1');
    if (quest) {
      quest.completed = true;
    }
    
    showMessage('Enemy defeated! Quest completed!');
    checkQuestCompletion();
  } else {
    showMessage(`Enemy HP: ${gameState.enemyHP}/100 | You took ${enemyDamage} damage`);
  }
  
  scene.updateUI();
  updateInteractionPrompt(scene, () => findNearbyEntity(scene));
}

