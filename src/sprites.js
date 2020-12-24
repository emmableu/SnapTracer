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
            this.data[s.name] = new Sprite(this.snapAdapter, s);
        }
    }

    getSpriteByName (name) {
        /**
         * @type{a Sprite}
         */
        for (const key of Object.keys(this.data)) {
            if (key === name) {
                return this.data[key];
            }
        }
    }

    getAllSpriteMorphs () {
        const world = this.snapAdapter.top.world;
        return world.children[0].sprites.contents;
    }

}
module.exports = Sprites;
