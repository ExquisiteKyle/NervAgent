// Movement Handling
import {
  PLAYER_SPEED,
  ENTITY_SIZE,
  VILLAGE_MIN_X,
  VILLAGE_MAX_X,
  VILLAGE_MIN_Y,
  VILLAGE_MAX_Y
} from '../gameConstants.js';
import { gameState } from '../gameState.js';

export function handleMovement(scene, checkQuestCompletion) {
  let velocityX = 0;
  let velocityY = 0;
  
  if (scene.cursors.left.isDown || scene.wasd.A.isDown) {
    velocityX = -PLAYER_SPEED;
  } else if (scene.cursors.right.isDown || scene.wasd.D.isDown) {
    velocityX = PLAYER_SPEED;
  }
  
  if (scene.cursors.up.isDown || scene.wasd.W.isDown) {
    velocityY = -PLAYER_SPEED;
  } else if (scene.cursors.down.isDown || scene.wasd.S.isDown) {
    velocityY = PLAYER_SPEED;
  }
  
  if (velocityX !== 0 || velocityY !== 0) {
    const newX = Phaser.Math.Clamp(
      gameState.playerPos.x + velocityX * scene.game.loop.delta / 1000,
      VILLAGE_MIN_X + ENTITY_SIZE,
      VILLAGE_MAX_X - ENTITY_SIZE
    );
    const newY = Phaser.Math.Clamp(
      gameState.playerPos.y + velocityY * scene.game.loop.delta / 1000,
      VILLAGE_MIN_Y + ENTITY_SIZE,
      VILLAGE_MAX_Y - ENTITY_SIZE
    );
    
    gameState.playerPos.x = newX;
    gameState.playerPos.y = newY;
    
    // Track movement for quest
    if (!gameState.playerMoved) {
      gameState.playerMoved = true;
      checkQuestCompletion();
    }
    
    // Sprite position is synced in updatePlayerAnimation()
  }
}

export function updatePlayerAnimation(scene) {
  if (!scene.player) return;

  const velocityX = (scene.cursors.left.isDown || scene.wasd.A.isDown) ? -1 :
                  (scene.cursors.right.isDown || scene.wasd.D.isDown) ? 1 : 0;
  const velocityY = (scene.cursors.up.isDown || scene.wasd.W.isDown) ? -1 :
                  (scene.cursors.down.isDown || scene.wasd.S.isDown) ? 1 : 0;

  const isMoving = velocityX !== 0 || velocityY !== 0;
  const state = isMoving ? 'walk' : 'idle';

  let direction = scene.playerFacing;
  let flipX = false;
  
  if (isMoving) {
    if (Math.abs(velocityY) > Math.abs(velocityX)) {
      direction = velocityY < 0 ? 'up' : 'down';
    } else {
      // Use right animations for horizontal movement, flip for left
      direction = 'right';
      flipX = velocityX < 0;
    }
  } else {
    // When idle, maintain last facing direction
    if (scene.playerFacing === 'right') {
      direction = 'right';
      flipX = scene.player.flipX; // Maintain flip state
    }
  }
  
  // Update animation when direction or state changed
  if (direction !== scene.playerFacing || isMoving !== scene.playerMoving) {
    scene.playerFacing = direction;
    scene.playerMoving = isMoving;
    
    const animKey = `player_${state}_${direction}`;
    
    if (scene.anims.exists(animKey)) {
      const currentAnim = scene.player.anims.currentAnim;
      if (!currentAnim || currentAnim.key !== animKey) {
        scene.player.play(animKey);
      }
    }
  }
  
  // Update flip state for horizontal movement
  scene.player.setFlipX(flipX);
  
  // Always sync sprite position with game state
  scene.player.setPosition(gameState.playerPos.x, gameState.playerPos.y);
}

export function updateHestiaPosition(scene) {
  if (!scene.hestia) return;
  
  // Calculate distance to player
  const dx = gameState.playerPos.x - gameState.hestia.pos.x;
  const dy = gameState.playerPos.y - gameState.hestia.pos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Follow player if too far
  if (distance > gameState.hestia.followDistance) {
    const lerp = 0.05; // Smooth follow speed
    gameState.hestia.pos.x += dx * lerp;
    gameState.hestia.pos.y += dy * lerp;
  }
  
  // Update sprite position
  scene.hestia.setPosition(gameState.hestia.pos.x, gameState.hestia.pos.y);
}

