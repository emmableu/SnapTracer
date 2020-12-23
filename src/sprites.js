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
        let allSprites = this.getAllSprites();
        for (let s of allSprites) {
            if (s.name === name) {
                return new Sprite(s)
            }
        }
    }

    getAllSprites () {
        let world = this.snapAdapter.top.world;
        return world.children[0].sprites.contents
    }

    isTouching (spriteNameA, spriteNameB) {
        let spriteA = this.getSpriteByName(spriteNameA);
        return spriteA.touching.includes(spriteNameB);
    }

    isOnEdge (spriteName, arrayOfEdges) {
        let sprite = this.getSpriteByName(spriteName);
        return arrayOfEdges.every(r => sprite.edges_touched.includes(r));
    }





}
module.exports = Sprites;
