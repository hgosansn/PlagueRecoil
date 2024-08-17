const tiles = {
    grass: { canBeNear: ['grass', 'sand'] },
    water: { canBeNear: ['water', 'sand'] },
    sand: { canBeNear: ['sand', 'grass', 'water'] },
};

/**
 * Implementing an infinite terrain generation using the Wave Function Collapse (WFC)
 * algorithm in a game, particularly one where the terrain is generated as the player moves,
 * is a complex but fascinating task.
 */

function generateGrid(size) {
    let grid = [];
    const gridSize = size ?? 10; // 10x10 grid

    for (let x = 0; x < gridSize; x++) {
        grid[x] = [];
        for (let y = 0; y < gridSize; y++) {
            grid[x][y] = Object.keys(tiles); // All tiles are possible initially
        }
    }
    return grid;
}

function collapseGrid(grid) {
    let collapsed = false;
    while (!collapsed) {
        collapsed = true;
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                if (grid[x][y].length > 1) {
                    grid[x][y] = [
                        grid[x][y][
                            Math.floor(Math.random() * grid[x][y].length)
                        ],
                    ]; // Randomly collapse
                    collapsed = false;
                }
                // Propagate constraints here
            }
        }
    }
}

function generateChunk(size) {
    const grid = generateGrid(size);
    collapseGrid(grid);
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            let tileType = grid[x][y][0];
            // Add code to create and position Phaser sprites based on tileType
            // Example: this.add.sprite(x * tileSize, y * tileSize, tileType);
        }
    }
    return grid;
}

class InfiniteTerrain {
    constructor(player, chunkSize) {
        this.player = player;
        this.chunkSize = chunkSize;
        this.currentChunks = [];
        this.generateInitialChunk();
    }

    generateInitialChunk() {
        let initialChunk = this.generateChunk();
        this.currentChunks.push(initialChunk);
        // Render initialChunk
    }

    update() {
        if (this.shouldGenerateNewChunk()) {
            let newChunk = this.generateChunk();
            this.currentChunks.push(newChunk);
            // Render newChunk

            this.disposeOldChunks();
        }
    }

    shouldGenerateNewChunk() {
        // Check if player is close to the edge of the current terrain
        // Return true if a new chunk needs to be generated
    }

    generateChunk() {
        // Use WFC to generate a new chunk
        // Ensure it aligns seamlessly with the existing chunk at the border
        // Return the generated chunk
    }

    disposeOldChunks() {
        // Dispose or recycle chunks that are far behind the player
    }
}
