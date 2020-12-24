const Sprite = require('./sprite');
class Sprites {

    constructor (snapAdapter) {
        /**
         * @type{SnapAdapter}
         */
        this.snapAdapter = snapAdapter;
        this.data = {};
        this.update();
    }

    update (){
        const allSpriteMorphs = this.getAllSpriteMorphs();
        for (const s of allSpriteMorphs){
            this.data[s.name] = Sprite(this.snapAdapter).update(s);
        }
    }

    getSpriteByName (name) {
        /**
         * @type{a Sprite}
         */
        for (const [key, value] of this.data) {
            if (key === name) {
                return value;
            }
        }
    }

    getAllSpriteMorphs () {
        const world = this.snapAdapter.top.world;
        return world.children[0].sprites.contents;
    }

}
module.exports = Sprites;
