import React from 'react';

import {
    gameWidth,
    gameHeight,
    backgroundWidth,
    backgroundHeight,
    floorSize,
    speed,
    gravity,
    bulletSpeed,
    jumpHeight,
    showPlatforms,
    debug,
} from './variables.js';
import MainScene from './scene.js';
import Preloader from './preloader.js';

var cvs = document.createElement('canvas');
cvs.setAttribute('id', 'game');

// Game configuration
var config = {
    type: Phaser.CANVAS,
    width: gameWidth,
    height: gameHeight,
    banner: false,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: gravity },
            debug: debug,
        },
    },
    scene: [Preloader, MainScene],
    canvas: cvs,
    parent: 'box',
    domain: 'hson.fr',
    callbacks: {
        postBoot: function (game) {
            game.canvas.style.width = '100%';
            game.canvas.style.height = '100%';
        },
    },
    fps: {
        target: 30,
        limit: 60,
    },
    transparent: true,
};
var game;

export class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = { game: null };
    }

    componentDidMount() {
        document.addEventListener('keydown', (e) => {
            // if key == escape
            if (e.key === 'Escape') {
                this.cleanGame();
            }
        });

        document.addEventListener('resize', (e) => {
            if (this.state.game) {
                this.state.game.resize(window.innerWidth, window.innerHeight);
            }
        });
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
    }

    componentWillUnmount() {
        if (this.state.game) {
            this.state.game.destroy(false);
            this.state.game = null;
        }
    }

    startGame = () => {
        this.setState({ game: new Phaser.Game(config) });
        document.getElementById('container').classList.add('gameplay_active');
    };

    cleanGame = () => {
        if (this.state.game) {
            this.state.game.destroy(false);
            this.state.game.events.on(Phaser.Core.Events.DESTROY, function () {
                // Perform cleanup tasks here
                game = null;
            });
            Array.from(document.getElementById('box').children).forEach(
                (child) => {
                    if (child.tagName === 'CANVAS') {
                        document.getElementById('box').removeChild(child);
                    }
                }
            );
            this.setState({ game: null });
            return;
        }
    };

    render() {
        return (
            <div className="header-ba">
                <div className="playPlaceHolder">
                    {this.state.game == null && (
                        <div onClick={this.startGame}>
                            <svg
                                viewBox="0 0 60 60"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    <filter
                                        id="glow"
                                        x="-50%"
                                        y="-50%"
                                        width="200%"
                                        height="200%"
                                    >
                                        <feGaussianBlur
                                            stdDeviation="2"
                                            result="coloredBlur"
                                        />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                <polygon
                                    points="25,20 25,40 40,30"
                                    fill="var(--accent)"
                                    filter="url(#glow)"
                                />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
