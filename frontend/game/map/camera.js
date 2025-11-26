// Camera Setup
import {
  VILLAGE_SIZE,
  VILLAGE_CENTER_X,
  VILLAGE_CENTER_Y,
  VILLAGE_MIN_X,
  VILLAGE_MIN_Y
} from '../gameConstants.js';

export function setupCamera(scene) {
  // Calculate camera bounds to center the village in the viewport
  // The camera should be able to position itself so the village appears centered
  const viewportWidth = scene.scale.width;
  const viewportHeight = scene.scale.height;
  
  // Calculate how much the viewport is larger than the village
  const extraWidth = Math.max(0, viewportWidth - VILLAGE_SIZE);
  const extraHeight = Math.max(0, viewportHeight - VILLAGE_SIZE);
  
  // Set camera bounds to allow centering - extend bounds by half the extra space on each side
  const boundsMinX = VILLAGE_MIN_X - extraWidth / 2;
  const boundsMinY = VILLAGE_MIN_Y - extraHeight / 2;
  const boundsWidth = VILLAGE_SIZE + extraWidth;
  const boundsHeight = VILLAGE_SIZE + extraHeight;
  
  scene.cameras.main.setBounds(
    boundsMinX,
    boundsMinY,
    boundsWidth,
    boundsHeight
  );
  
  // Center camera on village center initially to show village centered
  scene.cameras.main.centerOn(VILLAGE_CENTER_X, VILLAGE_CENTER_Y);
  
  // Then center on player
  scene.cameras.main.centerOn(scene.player.x, scene.player.y);
  
  // Follow player with smooth interpolation, centered
  scene.cameras.main.startFollow(scene.player, true, 0.1, 0.1);
  // No deadzone - keep player perfectly centered
  scene.cameras.main.setDeadzone(0, 0);
}

