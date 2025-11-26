// Highlight System
import { getGameScene } from '../core/gameScene.js';

export function highlightTile(x, y) {
  const scene = getGameScene();
  if (scene && typeof scene.highlightArea === 'function') {
    const pixelX = x * 40 + 20;
    const pixelY = y * 40 + 20;
    scene.highlightArea(pixelX, pixelY);
  }
}

export { highlightTile as highlightArea };

