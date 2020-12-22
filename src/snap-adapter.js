const {extend} = require('./isnap-util.js');
const _ = require('lodash');
const Sprites = require('./sprites.js');

class SnapAdapter {

    /**
     * @param {Window} top The Snap iframe
     */
    constructor (top) {

        /**
         * @type {Window}
         */
        this.top = top;

        /**
         * @type {IDE_Morph}
         */
        this.ide = top.world.children[0];

        /**
         * @type {number}
         */
        this.startTime = 0;

        /**
         * @type {Array}
         */
        this.trace = [];

        /**
         * @type {string} project raw XML String
         */
        this.project = null;

        /**
         * @type {Sprites}
         */
        this.sprites = new Sprites(this);

        
        this.initGrab();
    }

    initGrab () {
        this.initInstrumenter();
        this.ide.toggleAppMode(true);
    }

    /**
     * load project from raw XML String
     * @param {string} projectString raw XML string.
     */
    loadProject (projectString) {
        this.ide.rawOpenProjectString(projectString);
        this.ide.toggleAppMode(true);
    }

    start () {
        this.trace = [];
        this.startTime = Date.now();
        this.ide.pressStart();
    }

    end () {
        this.ide.stopAllScripts();
    }

    get stage () {
        return this.ide.stage;
    }

    initInstrumenter () {
        const that = this;
        extend(this.top.Process, 'evaluateBlock',
            function (base, block, argCount) {
                const sprite = this.context.receiver;
                that.trace.push({
                    clockTime: ((Date.now() - that.startTime) / 1000).toFixed(3),
                    sprite: {
                        name: sprite.name,
                        x: sprite.xPosition(),
                        y: sprite.yPosition(),
                        size: sprite.size,
                        direction: sprite.direction(),
                        touching: that.stage.children
                            .filter(c => (c !== sprite))
                            .filter(c => (c instanceof that.top.SpriteMorph))
                            .filter(c => sprite.isTouching(c))
                            .map(c => c.name),
                        variables: _.cloneDeep(sprite.variables.vars)
                    },
                    // TODO: convert to array of keys which maps to true
                    keysDown: _.cloneDeep(that.stage.keysPressed),
                    stageVariables: _.cloneDeep(that.stage.variables.vars)
                });
                base.call(this, block, argCount);
                // eslint-disable-next-line semi
            })
    }
}

module.exports = SnapAdapter;
