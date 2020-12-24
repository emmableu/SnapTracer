const Sprite = require('./sprite');
class Sprites {

    constructor (snapAdapter) {
        /**
         * @type{SnapAdapter}
         */
        this.snapAdapter = snapAdapter;

    }

    getSpriteByName (name) {
        /**
         * @type{Sprite(a SpriteMorph)}
         */
        const allSprites = this.getAllSprites();
        for (let s of allSprites) {
            if (s.name === name) {
                return new Sprite(this.snapAdapter, s);
            }
        }
    }

    getAllSprites () {
        const world = this.snapAdapter.top.world;
        return world.children[0].sprites.contents;
    }

    isTouching (spriteA, spriteNameB) {
        return spriteA.touching.includes(spriteNameB);
    }

    isOnEdge (sprite, arrayOfEdges) {
        return arrayOfEdges.every(r => sprite.edgesTouched.includes(r));
    }





}
module.exports = Sprites;
