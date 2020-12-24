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
        for (const s of allSprites) {
            if (s.name === name) {
                return new Sprite(this.snapAdapter, s);
            }
        }
    }

    getAllSprites () {
        return this.snapAdapter.stage.children;
        //const world = this.snapAdapter.top.world;
        //return world.children[0].sprites.contents;
    }

    isTouching (spriteNameA, spriteNameB) {
        const spriteA = this.getSpriteByName(spriteNameA);
        return spriteA.touching.includes(spriteNameB);
    }

    isOnEdge (spriteName, arrayOfEdges) {
        const sprite = this.getSpriteByName(spriteName);
        return arrayOfEdges.every(r => sprite.edges_touched.includes(r));
    }

}
module.exports = Sprites;
