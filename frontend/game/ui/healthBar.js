// Health Bar UI
import { gameState } from '../gameState.js';

export function createHealthBar(scene) {
  const panelX = 20;
  const panelY = 20;
  const panelWidth = 250;
  const panelHeight = 80;
  
  // Create container for health/stats panel (fixed to camera)
  scene.healthPanel = scene.add.container(panelX, panelY).setDepth(1500).setScrollFactor(0);
  
  // Background panel - using darker color with high opacity for better contrast
  const bgGraphics = scene.add.graphics();
  bgGraphics.fillStyle(0x000000, 0.85);  // Black background with high opacity
  bgGraphics.fillRoundedRect(0, 0, panelWidth, panelHeight, 4);
  bgGraphics.lineStyle(2, 0xffffff, 0.8);  // White border for contrast
  bgGraphics.strokeRoundedRect(0, 0, panelWidth, panelHeight, 4);
  bgGraphics.setScrollFactor(0);
  
  // HP Bar background
  const hpBarBg = scene.add.graphics();
  hpBarBg.fillStyle(0x1a252f, 1);
  hpBarBg.fillRoundedRect(10, 10, 230, 20, 2);
  hpBarBg.setScrollFactor(0);
  
  // HP Bar fill (will be updated)
  scene.hpBarFill = scene.add.graphics();
  scene.hpBarFill.setScrollFactor(0);
  
  // HP Text
  scene.hpText = scene.add.text(125, 22, 'HP: 100/100', {
    fontSize: '14px',
    color: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0.5).setScrollFactor(0);
  
  // Stats Text
  scene.statsText = scene.add.text(125, 50, 'ATK: 10 DEF: 5', {
    fontSize: '14px',
    color: '#ecf0f1'
  }).setOrigin(0.5).setScrollFactor(0);
  
  // Add all elements to container
  scene.healthPanel.add([bgGraphics, hpBarBg, scene.hpBarFill, scene.hpText, scene.statsText]);
}

export function updateHealthBar(scene) {
  if (!scene) return;
  
  const hpPercent = gameState.playerStats.hp / gameState.playerStats.maxHP;
  
  // Update HP bar fill
  if (scene.hpBarFill) {
    scene.hpBarFill.clear();
    const barWidth = 230 * hpPercent;
    const barColor = hpPercent > 0.5 ? 0x27ae60 : 0xe74c3c;
    scene.hpBarFill.fillStyle(barColor, 1);
    scene.hpBarFill.fillRoundedRect(10, 10, barWidth, 20, 2);
  }
  
  // Update HP text
  if (scene.hpText) {
    scene.hpText.setText(`HP: ${gameState.playerStats.hp}/${gameState.playerStats.maxHP}`);
  }
  
  // Update stats text
  if (scene.statsText) {
    scene.statsText.setText(`ATK: ${gameState.playerStats.attack} DEF: ${gameState.playerStats.defense}`);
  }
}

