// Inventory UI
import { ItemType } from '../gameConstants.js';
import { gameState } from '../gameState.js';

export function createInventoryUI(scene) {
  // Create inventory container (fixed position below health bar)
  const inventoryX = 20;
  const inventoryY = 20 + 80 + 10; // Below health bar (20 + 80 height + 10 spacing)
  const slotSize = 48;
  const slotSpacing = 4;
  const inventoryWidth = (slotSize + slotSpacing) * 4 - slotSpacing;
  
  // Create background panel
  const bgGraphics = scene.add.graphics();
  bgGraphics.fillStyle(0x2c3e50, 0.8);
  bgGraphics.fillRoundedRect(0, 0, inventoryWidth + 20, slotSize + 20, 4);
  bgGraphics.lineStyle(2, 0x34495e, 1);
  bgGraphics.strokeRoundedRect(0, 0, inventoryWidth + 20, slotSize + 20, 4);
  
  // Create 4 inventory slots
  scene.inventorySlots = [];
  scene.inventoryIcons = [];
  scene.inventorySlotNumbers = [];
  
  for (let i = 0; i < 4; i++) {
    const slotX = 10 + i * (slotSize + slotSpacing);
    const slotY = 10;
    
    // Slot background
    const slotBg = scene.add.graphics();
    slotBg.fillStyle(0x34495e, 1);
    slotBg.fillRect(slotX, slotY, slotSize, slotSize);
    slotBg.lineStyle(2, 0x1a252f, 1);
    slotBg.strokeRect(slotX, slotY, slotSize, slotSize);
    
    // Slot number text (1, 2, 3, 4)
    const slotNumber = scene.add.text(slotX + 4, slotY + 4, (i + 1).toString(), {
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setScrollFactor(0);
    
    scene.inventorySlots.push({ bg: slotBg, x: slotX, y: slotY, width: slotSize, height: slotSize });
    scene.inventoryIcons.push(null);
    scene.inventorySlotNumbers.push(slotNumber);
  }
  
  // Make inventory UI fixed to camera
  scene.inventoryContainer = scene.add.container(inventoryX, inventoryY, [bgGraphics, ...scene.inventorySlots.map(s => s.bg), ...scene.inventorySlotNumbers]);
  scene.inventoryContainer.setScrollFactor(0); // Fixed to camera
}

export function updateInventoryUI(scene) {
  // Clear existing icons
  scene.inventoryIcons.forEach(icon => {
    if (icon) {
      icon.destroy();
    }
  });
  scene.inventoryIcons = [];
  
  // Create icons for current inventory (max 4 slots)
  const maxSlots = 4;
  const slotSize = 48;
  
  for (let i = 0; i < maxSlots; i++) {
    const slot = scene.inventorySlots[i];
    if (i < gameState.inventory.length) {
      const item = gameState.inventory[i];
      
      // Create item icon graphics directly (not using sprite creation methods to avoid world positioning)
      const iconGraphics = scene.add.graphics();
      iconGraphics.setScrollFactor(0); // Fixed to camera
      
      if (item.type === ItemType.POTION) {
        // Potion icon
        iconGraphics.fillStyle(0xDD2222, 1);
        iconGraphics.fillRect(slot.x + 12, slot.y + 8, 24, 24);
        iconGraphics.fillStyle(0x991111, 1);
        iconGraphics.fillRect(slot.x + 16, slot.y + 4, 16, 8);
        iconGraphics.fillStyle(0x8B4513, 1);
        iconGraphics.fillCircle(slot.x + 24, slot.y + 4, 6);
      } else if (item.type === ItemType.KEY) {
        // Key icon
        iconGraphics.fillStyle(0xFFD700, 1);
        iconGraphics.fillCircle(slot.x + 24, slot.y + 18, 8);
        iconGraphics.fillStyle(0x000000, 1);
        iconGraphics.fillCircle(slot.x + 24, slot.y + 18, 3);
        iconGraphics.fillStyle(0xFFD700, 1);
        iconGraphics.fillRect(slot.x + 22, slot.y + 26, 4, 12);
        iconGraphics.fillRect(slot.x + 22, slot.y + 36, 4, 3);
        iconGraphics.fillRect(slot.x + 26, slot.y + 34, 3, 5);
      } else if (item.type === ItemType.SWORD) {
        // Sword icon
        iconGraphics.fillStyle(0xC0C0C0, 1);
        iconGraphics.fillRect(slot.x + 22, slot.y + 8, 4, 20);
        iconGraphics.fillTriangle(slot.x + 24, slot.y + 8, slot.x + 22, slot.y + 12, slot.x + 26, slot.y + 12);
        iconGraphics.fillStyle(0xFFD700, 1);
        iconGraphics.fillRect(slot.x + 18, slot.y + 26, 12, 2);
        iconGraphics.fillStyle(0x8B4513, 1);
        iconGraphics.fillRect(slot.x + 22, slot.y + 28, 4, 8);
        iconGraphics.fillStyle(0xFFD700, 1);
        iconGraphics.fillCircle(slot.x + 24, slot.y + 36, 4);
      }
      
      scene.inventoryContainer.add(iconGraphics);
      scene.inventoryIcons.push(iconGraphics);
    } else {
      scene.inventoryIcons.push(null);
    }
  }
}

