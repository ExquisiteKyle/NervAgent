// Dialogue Box System
import { t } from '../utils/i18n.js';

export function createDialogueBox(scene) {
  const boxWidth = Math.min(600, scene.scale.width - 40);  // Responsive width
  const boxHeight = 120;
  const boxX = 20;
  const boxY = scene.scale.height - boxHeight - 20; // Bottom of canvas
  
  // Container for entire dialogue box - fixed to camera
  scene.dialogueBox = scene.add.container(boxX, boxY).setDepth(2000).setVisible(false).setScrollFactor(0);
  
  // Dark semi-transparent background overlay
  const overlay = scene.add.graphics();
  overlay.fillStyle(0x000000, 0.7);
  overlay.fillRect(0, 0, boxWidth, boxHeight);
  overlay.setScrollFactor(0);
  
  // Border
  const border = scene.add.graphics();
  border.lineStyle(3, 0xffffff, 1);
  border.strokeRect(0, 0, boxWidth, boxHeight);
  border.setScrollFactor(0);
  
  // Speaker name background
  const nameBoxWidth = 150;
  const nameBoxHeight = 30;
  const nameBox = scene.add.graphics();
  nameBox.fillStyle(0x3498db, 1);
  nameBox.fillRect(0, -nameBoxHeight, nameBoxWidth, nameBoxHeight);
  nameBox.lineStyle(2, 0xffffff, 1);
  nameBox.strokeRect(0, -nameBoxHeight, nameBoxWidth, nameBoxHeight);
  nameBox.setScrollFactor(0);
  
  // Speaker name text
  scene.dialogueSpeaker = scene.add.text(nameBoxWidth / 2, -nameBoxHeight / 2, t('hestia.name'), {
    fontSize: '16px',
    color: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0.5).setScrollFactor(0);
  
  // Dialogue text
  scene.dialogueText = scene.add.text(20, 20, '', {
    fontSize: '16px',
    color: '#ffffff',
    wordWrap: { width: boxWidth - 40 },
    lineSpacing: 8
  }).setScrollFactor(0);
  
  // Continue indicator (Press E)
  scene.dialogueContinue = scene.add.text(boxWidth - 80, boxHeight - 30, t('ui.pressE'), {
    fontSize: '14px',
    color: '#ffffff',
    fontStyle: 'bold'
  }).setVisible(false).setScrollFactor(0);
  
  // Add blinking animation
  scene.tweens.add({
    targets: scene.dialogueContinue,
    alpha: 0.4,
    duration: 600,
    yoyo: true,
    repeat: -1
  });
  
  // Page indicator (e.g., "1/3")
  scene.dialoguePageIndicator = scene.add.text(boxWidth - 120, boxHeight - 30, '', {
    fontSize: '14px',
    color: '#cccccc'
  }).setVisible(false).setScrollFactor(0);
  
  // Add all elements to container
  scene.dialogueBox.add([overlay, border, nameBox, scene.dialogueSpeaker, scene.dialogueText, scene.dialogueContinue, scene.dialoguePageIndicator]);
  
  // Store dialogue state
  scene.currentDialogue = null;
  scene.dialoguePages = [];
  scene.currentPage = 0;
  scene.dialogueWaitingForInput = false;
  scene.dialogueWaitingForAI = false; // Prevent dismissal while waiting for AI
}

export function splitTextIntoPages(scene, text, maxWidth, maxHeight) {
  // Use a temporary text object to measure
  const testText = scene.add.text(0, 0, '', {
    fontSize: '16px',
    wordWrap: { width: maxWidth },
    lineSpacing: 8
  });
  
  const words = text.split(' ');
  const pages = [];
  let currentPage = '';
  
  for (let i = 0; i < words.length; i++) {
    const testLine = currentPage + (currentPage ? ' ' : '') + words[i];
    testText.setText(testLine);
    
    // Check actual rendered height
    if (testText.height > maxHeight) {
      // Adding this word would overflow, save current page
      if (currentPage) {
        pages.push(currentPage.trim());
      }
      // Start new page with current word
      currentPage = words[i];
    } else {
      currentPage = testLine;
    }
  }
  
  // Add remaining text as last page
  if (currentPage) {
    pages.push(currentPage.trim());
  }
  
  testText.destroy();
  return pages.length > 0 ? pages : [text];
}

export function showDialogue(scene, speaker, text, isWaitingForAI = false) {
  if (!scene.dialogueBox) {
    console.error('Dialogue box not initialized!');
    return;
  }
  
  scene.currentDialogue = text;
  scene.dialogueSpeaker.setText(speaker);
  scene.dialogueWaitingForAI = isWaitingForAI;
  
  // Split text into pages
  const boxWidth = Math.min(600, scene.scale.width - 40);
  const maxHeight = 70; // Maximum text height that fits in 120px box with padding
  scene.dialoguePages = splitTextIntoPages(scene, text, boxWidth - 40, maxHeight);
  scene.currentPage = 0;
  
  // Show first page
  updateDialoguePage(scene);
  
  // Make sure dialogue box is visible and on top
  scene.dialogueBox.setVisible(true);
  scene.dialogueBox.setDepth(2000);
  
  // Only show continue arrow if not waiting for AI
  scene.dialogueContinue.setVisible(!isWaitingForAI);
  scene.dialogueWaitingForInput = !isWaitingForAI;
  
  // Pause game while dialogue is showing
  scene.isDialogueActive = true;
}

export function updateDialoguePage(scene) {
  if (scene.currentPage < scene.dialoguePages.length) {
    scene.dialogueText.setText(scene.dialoguePages[scene.currentPage]);
    
    // Show page indicator if there are multiple pages
    if (scene.dialoguePages.length > 1) {
      scene.dialoguePageIndicator.setText(`${scene.currentPage + 1}/${scene.dialoguePages.length}`);
      scene.dialoguePageIndicator.setVisible(true);
    } else {
      scene.dialoguePageIndicator.setVisible(false);
    }
  }
}

export function hideDialogue(scene) {
  scene.dialogueBox.setVisible(false);
  scene.dialoguePageIndicator.setVisible(false);
  scene.currentDialogue = null;
  scene.dialoguePages = [];
  scene.currentPage = 0;
  scene.dialogueWaitingForInput = false;
  scene.dialogueWaitingForAI = false;
  scene.isDialogueActive = false;
}

export function advanceDialogue(scene) {
  // Only allow dismissal if not waiting for AI response
  if (scene.dialogueWaitingForInput && !scene.dialogueWaitingForAI) {
    // Check if there are more pages
    if (scene.currentPage < scene.dialoguePages.length - 1) {
      // Advance to next page
      scene.currentPage++;
      updateDialoguePage(scene);
    } else {
      // No more pages, dismiss dialogue
      hideDialogue(scene);
    }
  }
}

