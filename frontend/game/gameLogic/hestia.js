// Hestia (AI Companion) Logic
import { showDialogue } from '../dialogue/dialogueBox.js';
import { gameState } from '../gameState.js';

export function talkToHestia(scene) {
  // Prevent starting new conversation while waiting for AI
  if (scene.dialogueWaitingForAI) {
    return;
  }
  
  // Clear notification
  gameState.hestia.hasMessage = false;
  
  // Show loading message while waiting for AI (not dismissible)
  showDialogue(scene, 'Hestia', 'Connecting to the divine realm...', true);
  
  // Send event to backend to get Hestia's response
  if (typeof window.requestHestiaDialogue === 'function') {
    window.requestHestiaDialogue();
  }
}

