// Object Messages
import { ENTITY_SIZE } from '../gameConstants.js';

export function showObjectMessage(scene, x, y, text) {
  if (scene.objectMessage) {
    scene.objectMessage.destroy();
  }
  
  const container = scene.add.container(0, 0).setDepth(1000);
  const bg = scene.add.graphics();
  const messageText = scene.add.text(0, 0, text, {
    fontSize: '14px',
    color: '#ffffff',
    fontStyle: 'bold',
    backgroundColor: '#2c3e50',
    padding: { x: 12, y: 8 },
    wordWrap: { width: 200 }
  }).setOrigin(0.5);
  
  const textBounds = messageText.getBounds();
  const bgWidth = textBounds.width + 20;
  const bgHeight = textBounds.height + 16;
  
  bg.fillStyle(0x2c3e50, 0.9);
  bg.fillRoundedRect(
    -bgWidth / 2,
    -bgHeight / 2,
    bgWidth,
    bgHeight,
    8
  );
  bg.lineStyle(2, 0xffffff);
  bg.strokeRoundedRect(
    -bgWidth / 2,
    -bgHeight / 2,
    bgWidth,
    bgHeight,
    8
  );
  
  container.add([bg, messageText]);
  container.setPosition(x, y - ENTITY_SIZE / 2 - 30);
  container.setVisible(true);
  
  scene.objectMessage = container;
  scene.objectMessageDismissable = false;
  
  if (scene.objectMessageTimer) clearTimeout(scene.objectMessageTimer);
  scene.objectMessageTimer = setTimeout(() => {
    scene.objectMessageDismissable = true;
  }, 1000);
}

export function dismissObjectMessage(scene) {
  if (!scene.objectMessage || !scene.objectMessageDismissable) return;
  
  scene.objectMessage.destroy();
  scene.objectMessage = null;
  scene.objectMessageDismissable = false;
  
  if (scene.objectMessageTimer) {
    clearTimeout(scene.objectMessageTimer);
    scene.objectMessageTimer = null;
  }
}

