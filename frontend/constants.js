// Frontend translation strings and constants
const STRINGS = {
  INITIAL_GREETING: 'Greetings, adventurer! I am Hestia, your guide in this realm. I sense you\'re new to these lands. Fear not—I\'ll teach you the ways of movement, interaction, and combat. Ready to begin your journey?',
  ERROR_MESSAGE: 'Sorry, I encountered an error. Please try again.',
  PROGRESS_PREFIX: 'Progress:',
  PROGRESS_SUFFIX: 'objectives'
};

const API_URL = 'http://localhost:3000/api';

const ToolAction = {
  CHECK_PROGRESS: 'check_progress',
  HIGHLIGHT: 'highlight',
  CHECK_STATE: 'check_state',
  CHECK_GAME_STATE: 'check_game_state',
  HIGHLIGHT_TILE: 'highlight_tile',
  SET_OBJECTIVE: 'set_objective',
  UNLOCK_ABILITY: 'unlock_ability'
};

// Load translations from JSON (optional enhancement)
const loadTranslations = () => 
  fetch('./locales/en.json')
    .then(response => response.json())
    .then(data => {
      Object.assign(STRINGS, data);
      return STRINGS;
    })
    .catch(error => {
      console.error('Failed to load translations:', error);
      return STRINGS;
    });

// Translations will be loaded when window loads (see tutorial.js)

export { STRINGS, API_URL, ToolAction, loadTranslations };

