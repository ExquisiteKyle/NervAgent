// Animation Setup
export function createPlayerAnimations(scene) {
  // Fantasy Battle Pack layout (4 frames per animation, 12 rows):
  // Row 0 (0-3): Idle Down
  // Row 1 (4-7): Walk Down
  // Row 2 (8-11): Attack Down
  // Row 3 (12-15): Spell Down
  // Row 4 (16-19): Idle Right
  // Row 5 (20-23): Walk Right
  // Row 6 (24-27): Attack Right
  // Row 7 (28-31): Spell Right
  // Row 8 (32-35): Idle Up
  // Row 9 (36-39): Walk Up
  // Row 10 (40-43): Attack Up
  // Row 11 (44-47): Spell Up
  
  // Use frames 0-3 for all animations (confirmed working)
  // Will explore proper frame layout later
  const animations = [
    { key: 'player_idle_down', frames: [0, 1, 2, 3], frameRate: 6 },
    { key: 'player_walk_down', frames: [0, 1, 2, 3], frameRate: 8 },
    { key: 'player_idle_right', frames: [0, 1, 2, 3], frameRate: 6 },
    { key: 'player_walk_right', frames: [0, 1, 2, 3], frameRate: 8 },
    { key: 'player_idle_up', frames: [0, 1, 2, 3], frameRate: 6 },
    { key: 'player_walk_up', frames: [0, 1, 2, 3], frameRate: 8 }
  ];
  
  animations.forEach(anim => {
    if (!scene.anims.exists(anim.key)) {
      scene.anims.create({
        key: anim.key,
        frames: scene.anims.generateFrameNumbers('player', { frames: anim.frames }),
        frameRate: anim.frameRate,
        repeat: -1
      });
    }
  });
}

export function createNPCAnimations(scene, spriteKey) {
  const animKey = `${spriteKey}_idle`;
  if (!scene.anims.exists(animKey)) {
    // Use idle down animation (frames 0-3) for NPCs
    scene.anims.create({
      key: animKey,
      frames: scene.anims.generateFrameNumbers(spriteKey, { frames: [0, 1, 2, 3] }),
      frameRate: 4,
      repeat: -1
    });
  }
  return animKey;
}

export function createEnemyAnimations(scene) {
  if (!scene.anims.exists('enemy_idle')) {
    // Use idle down animation (frames 0-3) for enemy
    scene.anims.create({
      key: 'enemy_idle',
      frames: scene.anims.generateFrameNumbers('enemy', { frames: [0, 1, 2, 3] }),
      frameRate: 4,
      repeat: -1
    });
  }
}

export function createHestiaAnimations(scene) {
  if (!scene.anims.exists('hestia_idle')) {
    scene.anims.create({
      key: 'hestia_idle',
      frames: scene.anims.generateFrameNumbers('npc_wizard', { frames: [0, 1, 2, 3] }),
      frameRate: 4,
      repeat: -1
    });
  }
}

