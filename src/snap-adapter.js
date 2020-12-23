const {extend} = require('./isnap-util.js');
const _ = require('lodash');
const Stepper = require('./stepper.js');
const Inputs = require('./inputs.js');
const Events = require('./events.js');
const Sprites = require('./sprites.js');
const Variables = require('./variables.js');

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
         * @type {Boolean}
         */
        this.projectStarted = false;

        /**
         * @type {Sprites}
         */
        this.sprites = new Sprites(this);

        /**
         * @type {Stepper}
         */
        this.stepper = new Stepper(this);

        /**
         * @type {Inputs}
         */
        this.inputs = new Inputs(this);

        this.events = new Events(this);

        this.variables = new Variables(this);


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

    async start () {
        this.trace = [];
        this.startTime = Date.now();
        this.ide.pressStart();
        this.projectStarted = true;
        await new Promise(resolve =>
            setTimeout(() => {
                resolve(true);
            }, 1)
        );
        // don't know why need to start again
        this.ide.pressStart();
    }

    end () {
        this.ide.stopAllScripts();
        this.projectStarted = false;
    }

    pause () {
        this.stage.threads.pauseAll();
    }

    resume () {
        this.stage.threads.resumeAll();
    }


    /**
     * @returns {StageMorphic} the Snap stage
     */
    get stage () {
        // stage may update after loading the project
        return this.ide.stage;
    }

    initInstrumenter () {
        const that = this;
        extend(this.top.Process, 'evaluateBlock',
            function (base, block, argCount) {
                const sprite = this.context.receiver;
                const stageVariables = that.ide.globalVariables.vars;
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
                    keysDown: that.inputs.keysDown, //_.cloneDeep(that.stage.keysPressed),
                    stageVariables: Object.keys(stageVariables)
                        .map(v => ({
                            name: v,
                            value: stageVariables[v].value
                        }))
                });
                base.call(this, block, argCount);
                // eslint-disable-next-line semi
            })
    }
}

module.exports = SnapAdapter;
