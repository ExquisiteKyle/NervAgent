// Game Initialization
import { GameScene, getGameScene } from './gameScene.js';
import { Colors } from '../gameConstants.js';
import { gameState, getGameState, updateGameState } from '../gameState.js';
import { showDialogue as showDialogueFn } from '../dialogue/dialogueBox.js';
import { highlightTile } from '../gameLogic/highlight.js';

let phaserGame = null;

export function initRPG() {
  if (phaserGame) return;
  
  const config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: window.innerWidth * 0.5,
    height: window.innerHeight * 0.5,
    backgroundColor: Colors.BACKGROUND,
    scene: GameScene,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };
  
  phaserGame = new Phaser.Game(config);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (phaserGame && phaserGame.scale) {
      phaserGame.scale.resize(window.innerWidth * 0.5, window.innerHeight * 0.5);
    }
  });
}

export function showHestiaSpeech(message) {
  console.log('[DEBUG] Hestia message received:', message);
  console.log('[DEBUG] Message type:', typeof message);
  
  const scene = getGameScene();
  if (scene) {
    // Show AI response as dismissible (isWaitingForAI = false)
    showDialogueFn(scene, 'Hestia', message, false);
    // Clear the notification after showing message
    gameState.hestia.hasMessage = false;
  }
}

// Export for window object
window.highlightTile = highlightTile;
window.getGameState = getGameState;
window.updateGameState = updateGameState;
window.initRPG = initRPG;
window.showHestiaSpeech = showHestiaSpeech;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRPG);
} else {
  initRPG();
}

