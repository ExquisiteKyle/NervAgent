// Main Game Scene - Orchestrator
import Phaser from 'phaser';
import { preloadAssets } from '../assets/assetLoader.js';
import { createPlayerAnimations } from '../sprites/animations.js';
import { createBackground } from '../map/mapRenderer.js';
import { setupCamera } from '../map/camera.js';
import { createEntities } from './entities.js';
import { createInventoryUI, updateInventoryUI } from '../ui/inventory.js';
import { createHealthBar, updateHealthBar } from '../ui/healthBar.js';
import { createInteractionPrompt, updateInteractionPrompt } from '../ui/interactionPrompt.js';
import { createDialogueBox, showDialogue as showDialogueFn, advanceDialogue, hideDialogue } from '../dialogue/dialogueBox.js';
import { showSpeechBubble } from '../dialogue/speechBubbles.js';
import { showObjectMessage, dismissObjectMessage } from '../dialogue/objectMessages.js';
import { handleMovement, updatePlayerAnimation, updateHestiaPosition } from '../gameLogic/movement.js';
import { handleInteractions, findNearbyEntity, talkToNPC } from '../gameLogic/interactions.js';
import { collectItem, usePotion, showInventory } from '../gameLogic/items.js';
import { openChest, attackEnemy } from '../gameLogic/combat.js';
import { talkToHestia } from '../gameLogic/hestia.js';
import { checkQuestCompletion } from '../gameLogic/quests.js';
import {
  VILLAGE_SIZE,
  VILLAGE_MIN_X,
  VILLAGE_MIN_Y,
  Colors
} from '../gameConstants.js';
import { gameState } from '../gameState.js';

let gameScene = null;

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    preloadAssets(this);
  }

  create() {
    gameScene = this;
    
    // Set world bounds to village boundaries
    this.physics.world.setBounds(VILLAGE_MIN_X, VILLAGE_MIN_Y, VILLAGE_SIZE, VILLAGE_SIZE);
    
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
    
    // Initialize dialogue state
    this.isDialogueActive = false;
    
    createPlayerAnimations(this);
    createBackground(this);
    createEntities(this);
    setupCamera(this);
    createInventoryUI(this);
    createHealthBar(this);
    this.setupInput();
    this.setupHighlight();
    createInteractionPrompt(this);
    createDialogueBox(this);
    
    this.interactionKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.playerFacing = 'down';
    this.playerMoving = false;
  }

  setupInput() {
          this.input.keyboard.on('keydown-I', () => {
            if (!this.isDialogueActive) showInventory(this, this.showMessage.bind(this));
          });
          this.input.keyboard.on('keydown-H', () => {
            if (!this.isDialogueActive) usePotion(this, this.showMessage.bind(this), this.updateUI);
          });
          this.input.keyboard.on('keydown-P', () => {
            if (!this.isDialogueActive) usePotion(this, this.showMessage.bind(this), this.updateUI);
          });
    
    this.input.keyboard.on('keydown', (event) => {
      if (!this.isDialogueActive) {
        dismissObjectMessage(this);
      }
    });
  }

  setupHighlight() {
    this.highlightTimer = null;
  }

  updateUI() {
    updateHealthBar(this);
    if (this.inventorySlots) {
      updateInventoryUI(this);
    }
  }

  showMessage(text) {
    // Use showObjectMessage for canvas-based messages instead
    if (gameState.playerPos) {
      showObjectMessage(this, gameState.playerPos.x, gameState.playerPos.y, text);
    }
  }

  highlightArea(x, y, radius = 30) {
    gameState.highlightedArea = { x, y, radius };
    this.drawHighlight();
    
    if (this.highlightTimer) clearTimeout(this.highlightTimer);
    this.highlightTimer = setTimeout(() => {
      gameState.highlightedArea = null;
      this.drawHighlight();
    }, 3000);
  }

  drawHighlight() {
    this.highlightOverlay.clear();
    
    if (!gameState.highlightedArea) return;
    
    const { x, y, radius } = gameState.highlightedArea;
    this.highlightOverlay.lineStyle(4, Colors.HIGHLIGHT);
    this.highlightOverlay.strokeCircle(x, y, radius);
  }

  // Expose showDialogue for backward compatibility
  showDialogue(speaker, text, isWaitingForAI = false) {
    showDialogueFn(this, speaker, text, isWaitingForAI);
  }

  update() {
    // Always handle interactions (for dialogue advancement)
    handleInteractions(
      this,
      this.interactionKey,
      advanceDialogue,
      talkToHestia,
      (scene, npc) => talkToNPC(scene, npc, checkQuestCompletion),
      (scene, item) => collectItem(scene, item, checkQuestCompletion),
      (scene) => openChest(scene, checkQuestCompletion, () => scene.updateUI()),
      (scene) => attackEnemy(scene, checkQuestCompletion, this.showMessage.bind(this))
    );
    
    // Prevent movement during dialogue
    if (!this.isDialogueActive) {
      handleMovement(this, checkQuestCompletion);
      updatePlayerAnimation(this);
      updateInteractionPrompt(this, () => findNearbyEntity(this));
    }
    
    // Always update Hestia position
    updateHestiaPosition(this);
  }
}

export function getGameScene() {
  return gameScene;
}

