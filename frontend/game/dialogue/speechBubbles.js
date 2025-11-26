// Speech Bubbles
import { ENTITY_SIZE } from '../gameConstants.js';

export function createSpeechBubble(scene, entityId, x, y) {
  if (!scene.speechBubbles) {
    scene.speechBubbles = new Map();
  }
  
  if (scene.speechBubbles.has(entityId)) {
    return scene.speechBubbles.get(entityId);
  }
  
  const bubble = scene.add.container(0, 0).setDepth(1000).setVisible(false);
  
  const bubbleBg = scene.add.graphics();
  const bubbleText = scene.add.text(0, 0, '', {
    fontSize: '12px',
    color: '#2c3e50',
    fontStyle: 'bold',
    wordWrap: { width: 150 }
  }).setOrigin(0.5);
  
  bubble.add([bubbleBg, bubbleText]);
  bubble.bg = bubbleBg;
  bubble.text = bubbleText;
  bubble.entityX = x;
  bubble.entityY = y;
  
  scene.speechBubbles.set(entityId, bubble);
  return bubble;
}

export function drawSpeechBubble(scene, bubble, text) {
  const padding = 8;
  const tailHeight = 8;
  const tailWidth = 12;
  
  bubble.text.setText(text);
  const textBounds = bubble.text.getBounds();
  const bubbleWidth = Math.max(textBounds.width + padding * 2, 100);
  const bubbleHeight = textBounds.height + padding * 2;
  
  const bubbleX = bubble.entityX;
  const bubbleY = bubble.entityY - ENTITY_SIZE / 2 - bubbleHeight / 2 - tailHeight - 10;
  
  bubble.bg.clear();
  bubble.bg.fillStyle(0xffffff);
  bubble.bg.lineStyle(2, 0x2c3e50);
  
  const radius = 6;
  
  bubble.bg.fillRoundedRect(
    bubbleX - bubbleWidth / 2,
    bubbleY - bubbleHeight / 2,
    bubbleWidth,
    bubbleHeight,
    radius
  );
  
  bubble.bg.strokeRoundedRect(
    bubbleX - bubbleWidth / 2,
    bubbleY - bubbleHeight / 2,
    bubbleWidth,
    bubbleHeight,
    radius
  );
  
  bubble.bg.fillStyle(0xffffff);
  bubble.bg.lineStyle(2, 0x2c3e50);
  bubble.bg.beginPath();
  bubble.bg.moveTo(bubbleX - tailWidth / 2, bubbleY + bubbleHeight / 2);
  bubble.bg.lineTo(bubbleX, bubbleY + bubbleHeight / 2 + tailHeight);
  bubble.bg.lineTo(bubbleX + tailWidth / 2, bubbleY + bubbleHeight / 2);
  bubble.bg.closePath();
  bubble.bg.fillPath();
  bubble.bg.strokePath();
  
  bubble.text.setPosition(bubbleX, bubbleY);
  bubble.setPosition(0, 0);
  bubble.setVisible(true);
}

export function showSpeechBubble(scene, entityId, x, y, text, duration = 3000) {
  const bubble = createSpeechBubble(scene, entityId, x, y);
  bubble.entityX = x;
  bubble.entityY = y;
  drawSpeechBubble(scene, bubble, text);
  
  if (bubble.timer) clearTimeout(bubble.timer);
  bubble.timer = setTimeout(() => {
    bubble.setVisible(false);
  }, duration);
}

