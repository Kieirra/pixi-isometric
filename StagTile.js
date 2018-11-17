import * as PIXI from 'pixi.js';

const HEIGHT_STEP = 32,
    TILE_WIDTH = 128,
    TILE_HEIGHT = 64,
    TILE_HALF_WIDTH = TILE_WIDTH * 0.5,
    TILE_HALF_HEIGHT = TILE_HEIGHT * 0.5;

/**
 * The MapLevel class contains method to import and manipulate map 
 *
 * @class
 */
export default class StagTile extends PIXI.Sprite {

    constructor(jsonTile) {
        super(jsonTile.texture ?  PIXI.loader.resources[jsonTile.texture].texture : null);
        // Map coordinate
        this.i = jsonTile.i;
        this.j = jsonTile.j;
        this.h = jsonTile.h; // height in map
        // Screen coordinate
        const coord = StagTile.toScreen(jsonTile.i, jsonTile.j);
        this.x = coord.x;
        this.realY = coord.y;
        this.y = this.realY - this.h * HEIGHT_STEP;
        // Special
        this.isBlocked = jsonTile.isBlocked;

        // more performant...
        this.baseline = [
            [
                {"x": this.x,"y": this.y + StagTile.HEIGHT - StagTile.HALF_HEIGHT + (this.h * StagTile.HALF_HEIGHT)},
                {"x": this.x + StagTile.HALF_WIDTH,"y": this.y + StagTile.HEIGHT + (this.h * StagTile.HALF_HEIGHT)}
            ],
            [
                {"x": this.x + StagTile.HALF_WIDTH,"y": this.y + StagTile.HEIGHT + (this.h * StagTile.HALF_HEIGHT)},
                {"x": this.x + StagTile.WIDTH,"y": this.y + StagTile.HEIGHT - StagTile.HALF_HEIGHT + (this.h * StagTile.HALF_HEIGHT)}
            ]
        ];
    }

    toJson() {
        return {
            "i": this.i,
            "j": this.j,
            "h": this.h,
            "isBlocked": this.isBlocked,
            "texture": this._texture.textureCacheIds[0],
        };
    }

    /**
	 *	Convert map coordinate to screen coordinate (Generally do not use it, prefer the method below)
	 *	@param {Number} i
	 *	@param {Number} j
	 */
    static toScreen(i, j) {
        // To understand this we split the tile in 2 grid, even tile and odd)
        if (j % 2 === 0) {
            return { "x": i * TILE_WIDTH, "y": j * TILE_HALF_HEIGHT };
        } else {
            return { "x": TILE_HALF_WIDTH + i * TILE_WIDTH, "y": j * TILE_HALF_HEIGHT };
        }
    }

    /**
	 *	Give coordiante of the center of the map case (to place entity for instance)
	 *	@param {Number} i
	 *	@param {Number} j
	 */
    static toScreenCenter(i, j) {
        let { x, y } = StagTile.toScreen(i, j);
        x += TILE_HALF_WIDTH;
        y += TILE_HALF_HEIGHT;
        return { x, y };
    }

    /**
	 *	Convert screen coordinate to map coordinate 
	 *	@param {Number} x
	 *	@param {Number} y
	 */
    static toMap(x, y) {
        const evenTileX = Math.floor(x % TILE_WIDTH);
        const evenTileY = Math.floor(y % TILE_HEIGHT);

        // Distance between point and diamond center
        const dx = Math.abs(evenTileX - TILE_HALF_WIDTH);
        const dy = Math.abs(evenTileY - TILE_HALF_HEIGHT);
        if (dx / TILE_HALF_WIDTH + dy / TILE_HALF_HEIGHT <= 1) {
            // Inside so it's an even tile indeed
            return {
                i: Math.floor((x + TILE_WIDTH) / TILE_WIDTH) - 1,
                j: 2 * (Math.floor((y + TILE_HEIGHT) / TILE_HEIGHT) - 1),
            }
        } else {
            // Outside, odd tile
            return {
                i: Math.floor((x + TILE_HALF_WIDTH) / TILE_WIDTH) - 1,
                j: 2 * (Math.floor((y + TILE_HALF_HEIGHT) / TILE_HEIGHT)) - 1,
            }
        }
    }

    /* Origin of sprite is top left, Need to be X axis ordered
    get baseline() {
        return [
            [
                {"x": this.x,"y": this.y + StagTile.HEIGHT - StagTile.HALF_HEIGHT + (this.h * StagTile.HALF_HEIGHT)},
                {"x": this.x + StagTile.HALF_WIDTH,"y": this.y + StagTile.HEIGHT + (this.h * StagTile.HALF_HEIGHT)}
            ],
            [
                {"x": this.x + StagTile.HALF_WIDTH,"y": this.y + StagTile.HEIGHT + (this.h * StagTile.HALF_HEIGHT)},
                {"x": this.x + StagTile.WIDTH,"y": this.y + StagTile.HEIGHT - StagTile.HALF_HEIGHT + (this.h * StagTile.HALF_HEIGHT)}
            ]
        ];
    }*/

    set hMap(h) { this.h = parseInt(h); this.y = this.realY - this.h * HEIGHT_STEP }
    static get HEIGHT_STEP() { return HEIGHT_STEP; }
    static get HEIGHT() { return TILE_HEIGHT; }
    static get WIDTH() { return TILE_WIDTH; }
    static get HALF_WIDTH() { return TILE_HALF_WIDTH; }
    static get HALF_HEIGHT() { return TILE_HALF_HEIGHT; }
    static get CODE_BLOCKED() { return "blocked"; }
    static get CODE_INSTANCE() { return "instance"; }
}