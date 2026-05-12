/**
 * Configuration and Constants
 */

const CONFIG = {
    // Avatar emoji options
    avatarEmojis: [
        '👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🔧', '👨‍🎨', '👩‍🎨', '👨‍🍳', '👩‍🍳',
        '👨‍💻', '👩‍💻', '👨‍🏫', '👩‍🏫', '🧑‍🚀', '👨‍⚕️', '👩‍⚕️', '🧑‍🌾',
        '😀', '😊', '😎', '🤓', '🥳', '😺', '🐶', '🐱', '🐼', '🐨'
    ],

    // Store emoji options
    storeEmojis: ['🍚', '🍜', '🍱', '🥗', '🍛', '🥘', '🍲', '🍣', '🍔', '🌮', '🥙', '🍝',
                  '🍗', '🥩', '🍤', '🥪', '🍞', '🧆', '🫕', '🍥', '🍙', '🫔'],

    // Race configuration
    race: {
        minRacers: 2,
        maxRacers: 8,
        baseSpeed: 10, // base pixels per frame
        speedVariation: 3,
        animationSpeed: 20, // milliseconds per frame
    },

    // Confetti configuration
    confetti: {
        count: 100,
        colors: ['#B03020', '#C89B3C', '#4A7C59', '#7EB8D4', '#EDD9A3'],
        duration: 3000,
        delay: 30
    },

    // Pixel art palette (earthy street food market)
    palette: {
        brown:     '#5C3A1E',
        darkBrown: '#3B1F0A',
        gold:      '#C89B3C',
        darkGold:  '#8B6914',
        green:     '#4A7C59',
        darkGreen: '#2D4F38',
        cream:     '#F5E6C8',
        offWhite:  '#EDD9A3',
        red:       '#B03020',
        darkRed:   '#7A1A10',
        sky:       '#7EB8D4',
        road:      '#8A8060',
    },

    // CSS sprite configuration (GIF spritesheet from user)
    sprite: {
        frameWidth:    48,   // px — width of one frame in spritesheet
        frameHeight:   64,   // px — height of spritesheet
        frameCount:    4,    // number of animation frames
        fps:           8,    // animation fps (drives CSS steps)
        sheetPath:     'assets/images/runner-sprite.gif',
        fallbackEmoji: true, // show 🏃 if spritesheet not found
    },

    // Race track tile config
    track: {
        tilePath:    'assets/images/track-tile.png',
        tileWidth:   128, // px — width of repeating tile
        scrollSpeed: '0.5s',
        useCssTile:  true, // false = use PNG tile if provided
    },

    // Renderer flag: false = DOM (default), true = canvas
    renderer: {
        useCanvas: false,
    },

    // Storage keys
    storage: {
        racerData: 'racerData',
        storeData: 'storeData',
    },

    // UI elements
    selectors: {
        // Existing
        startBtn:        '#startBtn',
        racerManagement: '#racerManagement',
        raceTrack:       '#raceTrack',
        lanes:           '#lanes',
        emptyState:      '#emptyState',
        racerGrid:       '#racerGrid',
        newRacerName:    '#newRacerName',
        avatarPicker:    '#avatarPicker',
        importFile:      '#importFile',
        winnerModal:     '#winnerModal',
        winnerAvatar:    '#winnerAvatar',
        winnerName:      '#winnerName',
        // Tabs
        tabPeople:       '#tabPeople',
        tabStores:       '#tabStores',
        // Store management
        storeManagement: '#storeManagement',
        storeGrid:       '#storeGrid',
        newStoreName:    '#newStoreName',
        newStoreEmoji:   '#newStoreEmoji',
        newStoreTags:    '#newStoreTags',
        storeImportFile: '#storeImportFile',
        // Winner modal extras
        winnerTags:      '#winnerTags',
        winnerMessage:   '.winner-message',
    }
};

// Current race mode: 'people' | 'stores'
let currentMode = 'people';

// Log configuration loaded
console.log('Configuration loaded');
