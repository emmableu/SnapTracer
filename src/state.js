const Sprites = require('./sprites');

class Cache {
    constructor () {
        this.old = null;
        this.cur = null;
    }
    push (newData) {
        this.old = this.cur;
        this.cur = newData;
    }
}

// eslint-disable-next-line no-unused-vars
class State {
    constructor (snapAdapter) {
        this.snapAdapter = snapAdapter;
        this.spriteCache = new Cache();
        this.update();
    }
    update () {
        this.spriteCache.push(new Sprites(this.snapAdapter));
    }

    getSpriteByName (name, isCur = true) {
        /**
         * @type{a Sprite}
         */
        if (isCur) {
            return this.spriteCache.cur.getSpriteByName(name);
        }
        return this.spriteCache.old.getSpriteByName(name);

    }
}

module.exports = {Cache, State};
