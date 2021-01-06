const Sprites = require('./sprites');
const Variables = require('./variables');

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
        this.variableCache = new Cache();
        this.update();
    }
    update () {
        this.spriteCache.push(new Sprites(this.snapAdapter));
        this.variableCache.push(new Variables(this.snapAdapter));
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

    getFirstVariableValue (isCur = true) {
        /**
         * @type{Any}
         */
        if (isCur) {
            return this.variableCache.cur.firstVariable;
        }
        return this.variableCache.old.firstVariable;

    }
    spriteIsTouching (nameA, nameB, isCur = true) {
        const stateToCheck = isCur ? this.spriteCache.cur : this.spriteCache.old;
        return stateToCheck.getSpriteByName(nameA).isTouching(nameB);
    }

    spriteIsOnEdge (name, arrayOfEdges, isCur = true) {
        const stateToCheck = isCur ? this.spriteCache.cur : this.spriteCache.old;
        return stateToCheck.getSpriteByName(name).isOnEdge(arrayOfEdges);
    }
}

module.exports = {Cache, State};
