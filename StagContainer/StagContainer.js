import * as PIXI from 'pixi.js';
import StagTile from '../StagTile';

//Aliases
const Container = PIXI.Container;
// Index to sort all sprites (0 is the mose behind object)
let isoDepth = 0;

class StagContainer extends Container {

    addChild(child) {
        super.addChild(child);
        this.sortChildren();
    }

    sortChildren() {
        this.findDependencies(this.children);
        this.topsort(this.children);
        //this.children.sort(this.isBehind.bind(this))
    }

    findDependencies(children) {
        isoDepth = 0;
        for (let i = 0; i < children.length; i++) {
            children[i].isoSpritesBehind = [];
            for (let j = 0; j < children.length; j++) {
                if (i !== j) {
                    // this.children[j] is behind this.children[i] if > 0
                    if (this.isBehind(children[i], children[j]) > 0) {
                        children[i].isoSpritesBehind.push(children[j]);
                    }
                }
            }
            children[i].isoVisitedFlag = 0;
        }
    }

    isBehind(a, b) {
        if (a.isFront) return 1;
        if (b.isFront) return -1;
        if (a.isBack) return -1;
        if (b.isBack) return 1;

        if (this.isCompareOnlyPoints(a, b) || this.isCompareStaticObject(a,b)) {
            return (a.y + (a.h || 0) * StagTile.HEIGHT_STEP) - (b.y + (b.h || 0) * StagTile.HEIGHT_STEP);
        }
        if (this.isComparePointWithBaseline(a, b)) {
            const obj = a.baseline ? a : b;
            const p = a.baseline ? b : a;
            const sign = a.baseline ? 1 : -1;
            for (let i = 0; i < obj.baseline.length; i++) {
                const line = obj.baseline[i];
                if (this.isXAxisIntersection(line, p)) {
                    return (this.findY(line, p.x) - p.y) * sign;
                }
            }
        }
        if (this.isCompareOnlyBaseline(a, b)) {
            for (let j = 0; j < b.baseline.length; j++) {
                for (let i = 0; i < a.baseline.length; i++) {
                    const line = a.baseline[i];
                    if (this.isXAxisLineIntersection(line, b.baseline[j])) {
                        const x = this.getXIntersectionLine(line, b.baseline[j]);
                        const y = this.findY(b.baseline[j], x);
                        const diff = this.findY(line, x) - y;
                        if (diff !== 0) { return diff; } // Continue to check when we can't determine who is behind
                    }
                }
            }
        }
        return 0;
    }

    topsort(children) {
        for (let i = 0; i < children.length; i++) {
            this.visitNode(children[i]);
        }
        children.sort((a, b) => a.isoDepth - b.isoDepth);
    }

    visitNode(child) {
        if (child.isoVisitedFlag === 0) {
            child.isoVisitedFlag = 1;
            for (let i = 0; i < child.isoSpritesBehind.length; i++) {
                if (child.isoSpritesBehind[i] == null) { break; }
                else {
                    this.visitNode(child.isoSpritesBehind[i]);
                    child.isoSpritesBehind[i] = null;
                }
            }
            child.isoDepth = isoDepth++;
        }
    }

    destroyChildren() {
        while (this.children[0]) {
            this.removeChild(this.children[0]);
        }
    }

    /**
     *	Update dimension when resize event is catch
     */
    updateDimension(w, h) {
        this.screenWidth = w;
        this.screenHeight = h;
        this.screenhalfWidth = w / 2;
        this.screenhalfHeight = h / 2;
    }

    isOutOfScreen(child, top, bot, left, right) {
        return child.y < (top - 512)
                || child.y > (bot + 128)
                || child.x < (left - 64)
                || child.x > (right + 64)
    }


    // Fonction affine : y = mx + B, with m = (y2-y1)/(x2-x1) and B = y1
    findY(line, x) {
        const m = (line[1].y - line[0].y) / (line[1].x - line[0].x);
        return m * (x - line[0].x) + line[0].y;
    }
    getXIntersectionLine(l1, l2) {
        const left = Math.max(l1[0].x, l2[0].x)
        const right = Math.min(l1[1].x, l2[1].x)
        return (right + left) / 2;  // if left > right there's no intersection
    }
    isXAxisIntersection(line, p) { return p.x >= line[0].x && p.x <= line[1].x; }
    isXAxisLineIntersection(l1, l2) { 
        const left = Math.max(l1[0].x, l2[0].x)
        const right = Math.min(l1[1].x, l2[1].x)
        return left <= right; 
    }
    isCompareOnlyBaseline(a, b) { return a.baseline && b.baseline }
    isComparePointWithBaseline(a, b) { return !a.baseline && b.baseline || a.baseline && !b.baseline }
    isCompareOnlyPoints(a, b) { return !a.baseline && !b.baseline }
    isCompareStaticObject(a, b) { return a.isStatic && b.isStatic }
}

export default StagContainer;