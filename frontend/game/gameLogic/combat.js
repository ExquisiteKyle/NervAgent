// Combat System
import { ItemType } from '../gameConstants.js';
import { gameState } from '../gameState.js';
import { showDialogue } from '../dialogue/dialogueBox.js';
import { showObjectMessage } from '../dialogue/objectMessages.js';
import { updateInteractionPrompt } from '../ui/interactionPrompt.js';
import { findNearbyEntity } from './interactions.js';
import { t } from '../utils/i18n.js';

export function openChest(scene, checkQuestCompletion, updateUI) {
  // Check if player has learned to open chests
  if (!gameState.abilities.canOpenChest) {
    showDialogue(scene, t('dialogue.unknownSpeaker'), t('abilities.notLearnedOpenChest'), false);
    return;
  }
  
  if (gameState.chestRequiresKey) {
    const hasKey = gameState.inventory.some(item => item.type === ItemType.KEY);
    if (!hasKey) {
      showObjectMessage(scene, gameState.chestPos.x, gameState.chestPos.y, t('combat.chestLocked'));
      return;
    }
    
    const keyIndex = gameState.inventory.findIndex(item => item.type === ItemType.KEY);
    gameState.inventory.splice(keyIndex, 1);
  }
  
  gameState.chestOpened = true;
  scene.chest.setVisible(false);
  
  const gold = 50;
  showObjectMessage(scene, gameState.chestPos.x, gameState.chestPos.y, t('combat.chestOpened', { gold }));
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
    showDialogue(scene, t('dialogue.unknownSpeaker'), t('abilities.notLearnedCombat'), false);
    return;
  }
  
  const damage = gameState.playerStats.attack;
  gameState.enemyHP -= damage;
  
  const enemyDamage = Math.max(1, 10 - gameState.playerStats.defense);
  gameState.playerStats.hp -= enemyDamage;
  
  if (gameState.playerStats.hp <= 0) {
    gameState.playerStats.hp = 1;
    showMessage(t('combat.defeated'));
  }
  
  if (gameState.enemyHP <= 0) {
    gameState.enemyDefeated = true;
    scene.enemy.setVisible(false);
    
    const quest = gameState.quests.find(q => q.id === 'quest1');
    if (quest) {
      quest.completed = true;
    }
    
    showMessage(t('combat.enemyDefeated'));
    checkQuestCompletion();
  } else {
    showMessage(t('combat.enemyHP', { currentHP: gameState.enemyHP, damage: enemyDamage }));
  }
  
  scene.updateUI();
  updateInteractionPrompt(scene, () => findNearbyEntity(scene));
}

