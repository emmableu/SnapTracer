const _ = require('lodash');
const Stepper = require('./stepper.js');
const Inputs = require('./inputs.js');
const Variables = require('./variables.js');
const {Cache, State} = require('./state');
const Instrumenter = require('./instrumenter');

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
         * @type {string} project raw XML String
         */
        this.project = null;

        /**
         * @type {Boolean}
         */
        this.projectStarted = false;

        /**
         * @type {Stepper}
         */
        this.stepper = new Stepper(this);

        /**
         * @type {Inputs}
         */
        this.inputs = new Inputs(this);

        this.variables = new Variables(this);

        this.instrumenter = new Instrumenter(this);


        this.initGrab();
    }

    initGrab () {
        this.instrumenter.init();
        this.ide.toggleAppMode(true);
        this.initStateCache();
    }

    reset () {
        this.stepper.reset();
        this.instrumenter.reset();
        this.inputs.reset();
        this.projectStarted = false;
        this.initStateCache();
    }

    /**
     * load project from raw XML String
     * @param {string} projectString raw XML string.
     */
    loadProject (projectString) {
        this.ide.rawOpenProjectString(projectString);
        this.ide.toggleAppMode(true);
        this.instrumenter.detectProjectBlocks();
    }

    async start () {
        this.startTime = Date.now();
        this.ide.pressStart();
        this.projectStarted = true;
        await new Promise(resolve =>
            setTimeout(() => {
                resolve(true);
            }, 1)
        );
        // don't know why need to start again
        //this.ide.pressStart();
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

    initStateCache () {
        this.state = new State(this);
    }

    /**
     * @returns {StageMorphic} the Snap stage
     */
    get stage () {
        // stage may update after loading the project
        return this.ide.stage;
    }

    get trace () {
        return this.instrumenter.trace;
    }
}

module.exports = SnapAdapter;
