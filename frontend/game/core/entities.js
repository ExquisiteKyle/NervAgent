// Entity Creation and Management
import { gameState } from '../gameState.js';
import { ItemType } from '../gameConstants.js';
import * as SpriteFactory from '../sprites/spriteFactory.js';

export function createEntities(scene) {
  scene.entityObjects = {};
  
  scene.player = SpriteFactory.createPlayerSprite(
    scene,
    gameState.playerPos.x,
    gameState.playerPos.y
  );
  scene.entityObjects.player = { sprite: scene.player };
  
  // Create Hestia (companion sprite)
  scene.hestia = SpriteFactory.createHestiaSprite(
    scene,
    gameState.hestia.pos.x,
    gameState.hestia.pos.y
  );
  scene.hestiaNotification = SpriteFactory.createNotificationIcon(
    scene,
    gameState.hestia.pos.x,
    gameState.hestia.pos.y - 25
  );
  scene.entityObjects.hestia = { sprite: scene.hestia, notification: scene.hestiaNotification };
  
  gameState.npcs.forEach(npc => {
    scene.entityObjects[npc.id] = {
      sprite: SpriteFactory.createNPCSprite(scene, npc.pos.x, npc.pos.y, npc.type)
    };
  });
  
  gameState.items.forEach(item => {
    if (!item.collected) {
      let sprite;
      if (item.type === ItemType.POTION) {
        sprite = SpriteFactory.createPotionSprite(scene, item.pos.x, item.pos.y);
      } else if (item.type === ItemType.KEY) {
        sprite = SpriteFactory.createKeySprite(scene, item.pos.x, item.pos.y);
      } else if (item.type === ItemType.SWORD) {
        sprite = SpriteFactory.createSwordSprite(scene, item.pos.x, item.pos.y);
      }
      
      if (sprite) {
        scene.entityObjects[item.id] = { sprite };
      }
    }
  });
  
  scene.chest = SpriteFactory.createChestSprite(
    scene,
    gameState.chestPos.x,
    gameState.chestPos.y
  );
  scene.entityObjects.chest = { sprite: scene.chest };
  
  scene.enemy = SpriteFactory.createEnemySprite(
    scene,
    gameState.enemyPos.x,
    gameState.enemyPos.y
  );
  scene.entityObjects.enemy = { sprite: scene.enemy };
  
  scene.highlightOverlay = scene.add.graphics();
}

