// Interaction Prompt UI
import { ENTITY_SIZE, ItemType } from '../gameConstants.js';
import { gameState } from '../gameState.js';
import { t } from '../utils/i18n.js';

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
    promptText = t('interactions.pressEToTalkToHestia');
  } else if (nearbyEntity.type === 'npc') {
    const npc = nearbyEntity.npc;
    entityPos = npc.pos;
    if (npc.type === 'merchant') {
      promptText = t('interactions.pressEToTalkToMerchant');
    } else if (npc.type === 'quest_giver') {
      promptText = t('interactions.pressEToTalkToQuestGiver');
    } else {
      promptText = t('interactions.pressEToTalkToNPC');
    }
  } else if (nearbyEntity.type === 'item') {
    const item = nearbyEntity.item;
    entityPos = item.pos;
    const itemName = item.type === ItemType.POTION ? t('items.potion') :
                    item.type === ItemType.KEY ? t('items.key') :
                    item.type === ItemType.SWORD ? t('items.sword') : t('items.item');
    promptText = t('interactions.pressEToCollect', { itemName });
  } else if (nearbyEntity.type === 'chest') {
    entityPos = gameState.chestPos;
    promptText = t('interactions.pressEToOpenChest');
  } else if (nearbyEntity.type === 'enemy') {
    entityPos = gameState.enemyPos;
    promptText = t('interactions.pressEToAttackEnemy');
  }
  
  scene.interactionPrompt.setText(promptText);
  scene.interactionPrompt.setPosition(entityPos.x, entityPos.y - ENTITY_SIZE / 2 - 20);
  scene.interactionPrompt.setVisible(true);
}

