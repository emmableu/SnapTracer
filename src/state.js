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
        this.update();
    }
    update () {
        this.sprites = new Sprites(this.snapAdapter);
    }
}

module.exports = Cache;
module.exports = State;
