import * as PIXI from 'pixi.js';
import 'pixi-spine';
import StagTile from '../StagTile.js'

const Spine = PIXI.spine.Spine;
const IDLE_ANIMATION = "idle";

export default class StagEntity extends Spine {

    constructor({texture, size = 1, i, j, x, y, h = 0}) {
        super(PIXI.loader.resources[texture].spineData);
        this.texture = texture;
        // Anchor use to order sprite is by default at bottom center
        this.scale.x = parseFloat(size);
        this.scale.y = parseFloat(size);
        // Compute x,y & i,j positions
        if (i !== undefined  && j !== undefined ) {
            this.i = i;
            this.j = j;
            const { x, y } = StagTile.toScreenCenter(this.i, this.j);
            this.x = x;
            this.y = y;
        } else if (x !== undefined  && y !== undefined ) {
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
            "w": StagTile.WIDTH,
            "h": StagTile.HEIGHT,
        }
    }

    updateTick(deltaT) {
        // Store old position
        this.old.x = this.position.x;
        this.old.y = this.position.y;
        // Using i,j to move player does not work well so let's use x & y
        this.x += this.speed.x / 1000 * deltaT;
        this.y += this.speed.y / 1000 * deltaT;
        const { i, j } = StagTile.toMap(this.position.x, this.position.y);
        // Update new position
        this.i = i;
        this.j = j;
    }

    /*
        get x() { return this.spine.position.x}
        get y() { return this.spine.position.y}
        set x(a) { this.spine.position.x=a }
        set y(a) { this.spine.position.y=a }
    */

    toJson() {
        return {
            "x": this.x,
            "y": this.y,
            "h": this.h,
            "size": this.scale.x,
            "texture": this.texture,
        }
    }
}