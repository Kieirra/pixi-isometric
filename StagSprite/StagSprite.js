import StagTile from '../StagTile.js';
import * as PIXI from 'pixi.js';

const Sprite = PIXI.Sprite;

export default class StagSprite extends Sprite {

    constructor({texture = null, size = 1, x = 0, y = 0, h = 0}) {
        super(texture ? PIXI.loader.resources[texture].texture : null);
        // Anchor use to order sprite is by default at bottom center
        this.pivot.x = this.width / 2;
        this.pivot.y = this.height;
        this.scale.x = parseFloat(size);
        this.scale.y = parseFloat(size);
        // Coordinate
        this.x = x;
        this.y = y;
        // h is height IN map and it's use only to order sprite to display (Different to StagTile where there 'y' is modified too)
        this.h = parseFloat(h);

        this.isStatic = true;

        // more performant... need refactor
        //if (h <= 0) {
            this.baseline = [
                [
                    {"x": this.x - StagTile.HALF_WIDTH ,"y": this.y - StagTile.HALF_HEIGHT + (this.h * StagTile.HALF_HEIGHT)},
                    {"x": this.x,"y": this.y + (this.h * StagTile.HALF_HEIGHT) }
                ],
                [
                    {"x": this.x,"y": this.y + (this.h * StagTile.HALF_HEIGHT)},
                    {"x": this.x + StagTile.HALF_WIDTH,"y": this.y - StagTile.HALF_HEIGHT + (this.h * StagTile.HALF_HEIGHT) }
                ]
            ]
        /*} else {  // for height sprite we use only a linear baseline
            this.baseline = [
                [
                    {"x": this.x - StagTile.HALF_WIDTH ,"y": this.y + (this.h * StagTile.HALF_HEIGHT)},
                    {"x": this.x,"y": this.y + (this.h * StagTile.HALF_HEIGHT) }
                ]
            ]
        }*/
    }

    toJson() {
        return {
            "x": this.x,
            "y": this.y,
            "h": this.h,
            "size": this.scale.x,
            "texture": this._texture.textureCacheIds[0],
        }
    }

    /* Origin of sprite is bot mid, Need to be X axis ordered
    get baseline() {
        return [
            [
                {"x": this.x - StagTile.HALF_WIDTH ,"y": this.y - StagTile.HALF_HEIGHT + (this.h * StagTile.HALF_HEIGHT)},
                {"x": this.x,"y": this.y + (this.h * StagTile.HALF_HEIGHT) }
            ],
            [
                {"x": this.x,"y": this.y + (this.h * StagTile.HALF_HEIGHT)},
                {"x": this.x + StagTile.HALF_WIDTH,"y": this.y - StagTile.HALF_HEIGHT + (this.h * StagTile.HALF_HEIGHT) }
            ]
        ];
    }*/

}