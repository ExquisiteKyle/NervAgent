// Tutorial Agent Integration
import { STRINGS, API_URL, ToolAction, loadTranslations } from './constants.js';

const userId = `user_${Date.now()}`;

let conversationStarted = false;

// Chat UI removed - Hestia now in-game with speech bubbles

const sendInitialMessage = () => {
    console.log('Hestia ready! Press E near her to talk.');
    conversationStarted = true;
    
    // Set Hestia notification to true (! icon appears)
    if (typeof window.getGameState === 'function' && typeof window.updateGameState === 'function') {
        const gameState = window.getGameState();
        gameState.hestia.hasMessage = true;
        window.updateGameState(gameState);
    }
}

const notifyQuestCompletion = (completedQuestId, nextQuestId) => {
    const message = `[QUEST_COMPLETE] Completed: ${completedQuestId}, Next: ${nextQuestId || 'All Done'}`;
    notifyAgent(message);
}

// Proactive agent notifications for strategic guidance
const notifyAgent = (message) => {
    fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message,
            userId,
            appState: getAppState()
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('[AGENT] Received response:', data);
        console.log('[AGENT] Tool calls:', data.toolCalls);
        console.log('[AGENT] Reasoning:', data.reasoning);
        
        // Show Hestia's response in speech bubble
        if (data.message && typeof window.showHestiaSpeech === 'function') {
            window.showHestiaSpeech(data.message);
        }
        
        // Set notification icon
        if (typeof window.getGameState === 'function' && typeof window.updateGameState === 'function') {
            const gameState = window.getGameState();
            gameState.hestia.hasMessage = true;
            window.updateGameState(gameState);
        }
        
        if (data.toolCalls && data.toolCalls.length > 0) {
            console.log('[AGENT] Processing tool calls:', data.toolCalls);
            data.toolCalls.forEach(handleToolCall);
        }
    })
    .catch(error => {
        console.error('Error notifying agent:', error);
    });
}

// Notify agent of significant game events for proactive guidance
const notifyGameEvent = (eventType, eventData) => {
    const message = `[GAME_EVENT] ${eventType}: ${JSON.stringify(eventData)}`;
    notifyAgent(message);
}

window.addEventListener('load', () => {
    // Initialize RPG
    if (typeof window.initRPG === 'function') {
        window.initRPG();
    }
    
    // Wait for translations to load before initializing
    loadTranslations()
        .then(() => {
            setTimeout(() => {
                if (!conversationStarted) sendInitialMessage();
            }, 1000);
        })
        .catch(() => {
            // Fallback: try anyway after delay
            setTimeout(() => {
                if (!conversationStarted) sendInitialMessage();
            }, 1000);
        });
});

const handleToolCall = (toolCall) => {
    console.log('[DEBUG] handleToolCall called with:', toolCall);
    console.log('[DEBUG] Tool action:', toolCall.action);
    console.log('[DEBUG] Tool data:', toolCall.data);
    
    if (toolCall.action === ToolAction.HIGHLIGHT) {
        return highlightElement(toolCall.target);
    }
    if (toolCall.action === ToolAction.HIGHLIGHT_TILE) {
        return highlightTile(toolCall.data?.x, toolCall.data?.y);
    }
    if (toolCall.action === ToolAction.UNLOCK_ABILITY) {
        console.log('[DEBUG] Matched UNLOCK_ABILITY action');
        return unlockAbilities(toolCall.data);
    }
    
    console.log('[DEBUG] No matching action handler for:', toolCall.action);
};

const unlockAbilities = (abilities) => {
    console.log('[DEBUG] unlockAbilities called with:', abilities);
    
    if (typeof window.getGameState === 'function' && typeof window.updateGameState === 'function') {
        const gameState = window.getGameState();
        
        console.log('[DEBUG] Current abilities before unlock:', gameState.abilities);
        
        // Update abilities
        if (abilities.canInteract !== undefined) gameState.abilities.canInteract = abilities.canInteract;
        if (abilities.canCollect !== undefined) gameState.abilities.canCollect = abilities.canCollect;
        if (abilities.canOpenChest !== undefined) gameState.abilities.canOpenChest = abilities.canOpenChest;
        if (abilities.canFight !== undefined) gameState.abilities.canFight = abilities.canFight;
        
        window.updateGameState(gameState);
        
        console.log('[DEBUG] Abilities after unlock:', gameState.abilities);
        console.log('[DEBUG] Abilities unlocked successfully:', abilities);
    } else {
        console.error('[DEBUG] getGameState or updateGameState not available');
    }
};

const highlightElement = (elementId) => {
    document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
    
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.classList.add('highlight');
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => element.classList.remove('highlight'), 3000);
}

const highlightTile = (x, y) => {
    if (typeof window.highlightTile === 'function') {
        window.highlightTile(x, y);
    }
}

const getAppState = () => {
    const gameState = typeof window.getGameState === 'function' 
        ? window.getGameState() 
        : null;
    
    return {
        game: gameState
    };
};

// Progress tracking removed - progression is now gated by Hestia's ability unlocks

// Idle timer for adaptive hints
let idleTimer = null;
const IDLE_TIMEOUT = 30000; // 30 seconds

const resetIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    
    idleTimer = setTimeout(() => {
        // Send idle notification to Hestia
        fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: '[IDLE] Player has been idle for 30 seconds',
                userId,
                appState: getAppState()
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                addMessage('assistant', data.message, data.reasoning);
            }
            if (data.toolCalls) {
                data.toolCalls.forEach(handleToolCall);
            }
        })
        .catch(error => console.error('Error sending idle notification:', error));
    }, IDLE_TIMEOUT);
};

// Reset idle timer on user activity
document.addEventListener('keydown', resetIdleTimer);
document.addEventListener('mousedown', resetIdleTimer);
document.addEventListener('click', resetIdleTimer);

// Start the idle timer
resetIdleTimer();

// Function to request dialogue when player presses E
const requestHestiaDialogue = () => {
    const message = '[TALK] Player initiated conversation with Hestia';
    
    fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message,
            userId,
            appState: getAppState()
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('[DEBUG] Received from backend:', data);
        console.log('[DEBUG] Tool calls:', data.toolCalls);
        
        // Show Hestia's response in speech bubble
        if (data.message && typeof window.showHestiaSpeech === 'function') {
            window.showHestiaSpeech(data.message);
        }
        
        if (data.toolCalls && data.toolCalls.length > 0) {
            console.log('[DEBUG] Processing tool calls:', data.toolCalls);
            data.toolCalls.forEach(handleToolCall);
        } else {
            console.log('[DEBUG] No tool calls to process');
        }
    })
    .catch(error => console.error('Error getting Hestia dialogue:', error));
};

// Expose to window for rpg.js to call
window.requestHestiaDialogue = requestHestiaDialogue;
window.notifyGameEvent = notifyGameEvent;

// Export for use in rpg.js
export { sendInitialMessage, notifyQuestCompletion };

