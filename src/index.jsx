import React from 'react';
import ReactDOM from 'react-dom/client';

// Styles
import './styles/style.scss';

const initLog = () => {
    console.log(`Tag ${VERSION}`);
    console.log(`Built on ${BUILT}`);
};

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.setAttribute('crossorigin', 'anonymous');
        script.setAttribute('referrerpolicy', 'no-referrer');
        script.onload = () => resolve(script);
        script.onerror = () =>
            reject(new Error(`Script load error for ${src}`));
        document.head.append(script);
    });
}

/**
 * Lazy load Phaser.js
 */
var loadGame = async () => {
    // Load the game only if the browser agent says it's not a mobile device
    console.log('Loading Phaser.js');
    await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.60.0/phaser.min.js'
    );
    console.log('Phaser.js loaded');
    // Load the game
    console.log('Loading game');
    const { Game } = await import(
        /* webpackChunkName: "game_main" */ './js/game/game_main.jsx'
    );
    ReactDOM.createRoot(document.getElementById('root')).render(<Game />);
};

/**
 * Initialize the content
 */
function initContent() {
    // Remove the disabled attribute from all stylesheets
    Array.from(document.getElementsByClassName('disabledStylesheet')).forEach(
        (el) => {
            el.removeAttribute('disabled');
        }
    );
    // Remove the loading class from all elements
    Array.from(document.getElementsByClassName('loading')).forEach((el) => {
        el.classList.remove('loading');
    });
}

window.onload = () => {
    initLog();
    initContent();
    loadGame();
};
