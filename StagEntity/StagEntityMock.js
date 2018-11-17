import * as PIXI from 'pixi.js';
import StagTile from '../StagTile.js'

const IDLE_ANIMATION = "idle";

export default class StagEntityMock extends PIXI.Sprite {

    constructor({size = 1, i, j, x, y, h = 0}) {
        super();
        //this.texture = jsonSprite.texture;

        //MOCK
        this.state = {};
        this.state.setAnimation = function () { };

        // Anchor use to order sprite is by default at bottom center
        this.scale.x = parseFloat(size) || 1;
        this.scale.y = parseFloat(size) || 1;
        // Compute x,y & i,j positions
        if (i !== undefined && j !== undefined ) {
            this.i = i;
            this.j = j;
            const { x, y } = StagTile.toScreenCenter(this.i, this.j);
            this.x = x;
            this.y = y;
        } else if (x !== undefined && y !== undefined ) {
            this.x = x
            this.y = y;
            const { i, j } = StagTile.toMap(this.x, this.y);
            this.i = i;
            this.j = j;
        } else {
            this.x = 0;
            this.y = 0;
            this.i = 0;
            this.j = 0;
        }
        // Old positions use to resolve collision
        this.old = { "x": this.x, "y": this.y };
        // h is height IN map and it's use only to order sprite to display (Different to StagTile where there 'y' is modified too)
        this.h = parseFloat(h);
        // Speed (Tile by sec)
        this.speed = {};
        this.speed.x = 0;
        this.speed.y = 0;
        // Default animation
        this.state.setAnimation(0, IDLE_ANIMATION, true);
        // Default Bounding box
        this.bbox = {
            "w": 40,
            "h": 32,
        }
    }

    updateTick(deltaT) {
        // Store old position
        this.old.x = this.position.x;
        this.old.y = this.position.y;
        this.old.i = this.i;
        this.old.j = this.j;
        // Using i,j to move player does not work well so let's use x & y
        this.position.x += this.speed.x / 1000 * deltaT;
        this.position.y += this.speed.y / 1000 * deltaT;
        const { i, j } = StagTile.toMap(this.position.x, this.position.y);
        // Update new position
        this.i = i;
        this.j = j;
    }

    toJson() {
        return {
            "x": this.x,
            "y": this.y,
            "h": this.h,
            "size": this.scale.x,
            "texture": this.texture,
        }
    }

    // Origin of sprite is bot mid, Need to be X axis ordered
    get baseline() {
        return [
            [
                { "x": this.x - 32, "y": this.y },
                { "x": this.x + 32, "y": this.y }
            ]
        ];
    }
}