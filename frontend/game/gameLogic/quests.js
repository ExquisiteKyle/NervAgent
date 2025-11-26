// Quest Management
import { QUESTS } from '../gameConstants.js';
import { gameState } from '../gameState.js';

export function checkQuestCompletion() {
  const currentQuest = gameState.currentQuest;
  
  if (currentQuest === QUESTS.MOVEMENT.id && gameState.playerMoved) {
    completeQuest(QUESTS.MOVEMENT.id, QUESTS.TALK_NPC.id);
  } else if (currentQuest === QUESTS.TALK_NPC.id && gameState.npcs.some(npc => npc.talked)) {
    completeQuest(QUESTS.TALK_NPC.id, QUESTS.COLLECT_ITEMS.id);
  } else if (currentQuest === QUESTS.COLLECT_ITEMS.id && gameState.inventory.length > 0) {
    completeQuest(QUESTS.COLLECT_ITEMS.id, QUESTS.OPEN_CHEST.id);
  } else if (currentQuest === QUESTS.OPEN_CHEST.id && gameState.chestOpened) {
    completeQuest(QUESTS.OPEN_CHEST.id, QUESTS.DEFEAT_ENEMY.id);
  } else if (currentQuest === QUESTS.DEFEAT_ENEMY.id && gameState.enemyDefeated) {
    completeQuest(QUESTS.DEFEAT_ENEMY.id, null);
  }
}

export function completeQuest(completedQuestId, nextQuestId) {
  if (!gameState.questsCompleted.includes(completedQuestId)) {
    gameState.questsCompleted.push(completedQuestId);
    
    if (nextQuestId) {
      gameState.currentQuest = nextQuestId;
    } else {
      gameState.currentQuest = null;
    }
    
    // Show notification icon to indicate player should talk to Hestia
    gameState.hestia.hasMessage = true;
  }
}

