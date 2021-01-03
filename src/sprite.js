const _ = require('lodash');

class Sprite {

    constructor (snapAdapter, spriteMorph) {
        /**
         * @type{SpriteMorph}
         */
        this.snapAdapter = snapAdapter;
        this.update(spriteMorph);
    }

    update (spriteMorph) {
        this.name = spriteMorph.name;
        this.posX = spriteMorph.xPosition();
        this.posY = spriteMorph.yPosition();
        this.size = spriteMorph.size;
        this.dir = spriteMorph.direction();
        this.dirX = Math.cos(this.radians(spriteMorph.direction() - 90));
        this.dirY = Math.sin(this.radians(spriteMorph.direction() - 90));
        this.touching = this.calcTouching(spriteMorph);
        this.variables = _.cloneDeep(spriteMorph.variables.vars);
        this.edgesTouched = this.calcEdgesTouched(spriteMorph);
    }

    radians (degrees) {
        return degrees * Math.PI / 180;
    }

    calcTouching (spriteMorph){
        return this.snapAdapter.stage.children
            .filter(c => (c !== spriteMorph))
            .filter(c => (c instanceof this.snapAdapter.top.SpriteMorph))
            .filter(c => spriteMorph.isTouching(c))
            .map(c => c.name);
    }

    calcEdgesTouched (spriteMorph) {
        const padding = 10;
        const fb = spriteMorph.nestingBounds();
        const stage = this.snapAdapter.stage;
        const edgesTouched = [];

        if (fb.left() < stage.left() + padding) {
            edgesTouched.push('left');
        }
        if (fb.right() > stage.right() - padding) {
            edgesTouched.push('right');
        }
        if (fb.top() < stage.top() + padding) {
            edgesTouched.push('top');
        }
        if (fb.bottom() > stage.bottom() - padding) {
            edgesTouched.push('bottom');
        }
        return edgesTouched;
    }

    isTouching (spriteNameB) {
        return this.touching.includes(spriteNameB);
    }

    isOnEdge (arrayOfEdges) {
        return arrayOfEdges.filter(r => this.edgesTouched.includes(r)).length > 0;
    }

}
module.exports = Sprite;
