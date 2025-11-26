// Sprite Creation Factory
import { createNPCAnimations, createEnemyAnimations, createHestiaAnimations } from './animations.js';

export function createPlayerSprite(scene, x, y) {
  const sprite = scene.add.sprite(x, y, 'player', 0);
  sprite.setOrigin(0.5, 0.5);
  sprite.setScale(2);
  sprite.play('player_idle_down');
  return sprite;
}

export function createNPCSprite(scene, x, y, npcType) {
  let spriteKey = 'npc_knight';
  
  if (npcType === 'merchant') {
    spriteKey = 'npc_merchant';
  } else if (npcType === 'quest_giver') {
    spriteKey = 'npc_wizard';
  }
  
  const animKey = createNPCAnimations(scene, spriteKey);
  
  const sprite = scene.add.sprite(x, y, spriteKey, 0);
  sprite.setOrigin(0.5, 0.5);
  sprite.setScale(2);
  sprite.play(animKey);
  return sprite;
}

export function createPotionSprite(scene, x, y) {
  // Create a red potion bottle shape
  const graphics = scene.add.graphics();
  
  // Bottle body (red rectangle)
  graphics.fillStyle(0xDD2222, 1);
  graphics.fillRect(-6, -4, 12, 12);
  
  // Bottle neck (darker red)
  graphics.fillStyle(0x991111, 1);
  graphics.fillRect(-4, -8, 8, 4);
  
  // Cork/cap (brown)
  graphics.fillStyle(0x8B4513, 1);
  graphics.fillCircle(0, -8, 4);
  
  const container = scene.add.container(x, y, [graphics]);
  container.setScale(2);
  return container;
}

export function createKeySprite(scene, x, y) {
  // Create a golden key shape
  const graphics = scene.add.graphics();
  
  // Key head (circle)
  graphics.fillStyle(0xFFD700, 1);
  graphics.fillCircle(0, -6, 5);
  
  // Key hole in head
  graphics.fillStyle(0x000000, 1);
  graphics.fillCircle(0, -6, 2);
  
  // Key shaft
  graphics.fillStyle(0xFFD700, 1);
  graphics.fillRect(-2, -1, 4, 10);
  
  // Key teeth
  graphics.fillRect(-2, 7, 4, 2);
  graphics.fillRect(2, 5, 2, 4);
  
  const container = scene.add.container(x, y, [graphics]);
  container.setScale(2);
  return container;
}

export function createSwordSprite(scene, x, y) {
  // Create a silver sword shape
  const graphics = scene.add.graphics();
  
  // Sword blade (silver)
  graphics.fillStyle(0xC0C0C0, 1);
  graphics.fillRect(-2, -12, 4, 16);
  
  // Sword tip (triangle)
  graphics.fillTriangle(0, -12, -2, -8, 2, -8);
  
  // Sword guard (gold)
  graphics.fillStyle(0xFFD700, 1);
  graphics.fillRect(-6, 3, 12, 2);
  
  // Sword handle (brown)
  graphics.fillStyle(0x8B4513, 1);
  graphics.fillRect(-2, 5, 4, 6);
  
  // Sword pommel (gold)
  graphics.fillStyle(0xFFD700, 1);
  graphics.fillCircle(0, 11, 3);
  
  const container = scene.add.container(x, y, [graphics]);
  container.setScale(2);
  return container;
}

export function createChestSprite(scene, x, y) {
  // Create a treasure chest shape
  const graphics = scene.add.graphics();
  
  // Chest body (brown)
  graphics.fillStyle(0x8B4513, 1);
  graphics.fillRect(-10, -6, 20, 12);
  
  // Chest lid (darker brown)
  graphics.fillStyle(0x654321, 1);
  graphics.fillRect(-10, -10, 20, 4);
  
  // Gold trim on lid
  graphics.lineStyle(2, 0xFFD700, 1);
  graphics.strokeRect(-10, -10, 20, 4);
  
  // Gold lock
  graphics.fillStyle(0xFFD700, 1);
  graphics.fillRect(-3, -2, 6, 4);
  graphics.fillCircle(0, 0, 2);
  
  const container = scene.add.container(x, y, [graphics]);
  container.setScale(2);
  return container;
}

export function createEnemySprite(scene, x, y) {
  createEnemyAnimations(scene);
  
  const sprite = scene.add.sprite(x, y, 'enemy', 0);
  sprite.setOrigin(0.5, 0.5);
  sprite.setScale(2);
  sprite.play('enemy_idle');
  return sprite;
}

export function createHestiaSprite(scene, x, y) {
  // Use wizard sprite for Hestia
  createHestiaAnimations(scene);
  
  const sprite = scene.add.sprite(x, y, 'npc_wizard', 0);
  sprite.setOrigin(0.5, 0.5);
  sprite.setScale(2);
  sprite.play('hestia_idle');
  return sprite;
}

export function createNotificationIcon(scene, x, y) {
  // Notification icon removed - return null
  return null;
}

