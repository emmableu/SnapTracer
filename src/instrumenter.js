const {extend} = require('./isnap-util.js');
const _ = require('lodash');
class Instrumenter {

    constructor (snapAdapter) {
        /**
         * @type{SnapAdapter}
         */
        this.snapAdapter = snapAdapter;

        /**
         * @type {Array}
         */
        this.trace = null;

        /**
         * @type {Set<String>} All reachable blocks of the project
         */
        this.projectBlocks = new Set();

        /**
         * @type {Set<String>} All covered blocks of the project
         */
        this.coveredBlocks = new Set();

        /**
         * @type {number}
         */
        this.deadCodeSize = 0;
    }

    /**
     * Initialize the instrumenter
     * Heads-up: Do not call it more than once
     * as it extends the Process.prototype.evaluateBlock
     */
    init () {

        this.trace = [];
        const that = this;

        this.snapAdapter.top.StageMorph.prototype.enablePenLogging = true;

        extend(this.snapAdapter.top.Process, 'evaluateBlock',
            function (base, block, argCount) {
                that.coveredBlocks.add(block);
                base.call(this, block, argCount);

            });
        extend(this.snapAdapter.top.StageMorph, 'step',
            function (base) {
                if (that.snapAdapter.stepper.running) {
                    that.snapAdapter.stepper.step();
                }
                base.call(this);
                if (that.snapAdapter.stepper.running) {
                    that.snapAdapter.state.update();
                }
            });

        /* Below can only be used after project is loaded
        const stageStep = this.snapAdapter.stage.step;
        this.snapAdapter.stage.step = function () {
            if (that.snapAdapter.stepper.running) {
                that.snapAdapter.stepper.step();
            }
            stageStep.call(that.snapAdapter.stage);
            if (that.snapAdapter.stepper.running) {
                that.snapAdapter.state.update();
            }
        };
        */
    }

    /*
     * Encode bounds of a block as its Id
     * @access{private}
     * @param {Object} bounds. The bounds attribute of a block
     *                         (rounded to 3 digits)
     * @returns {String} Id. The id string
     */
    _boundsAsId (bounds) {
        // TODO: check if this is robust for custom block
        // It seems that the arragenment of blocks in
        // the custom block definition are stick to grid

        const x = bounds.corner.x.toFixed(3);
        const y = bounds.corner.y.toFixed(3);
        return `${x}-${y}`;
    }

    detectProjectBlocks () {

        // this.projectBlocks.clear();
        // use the line below for debugging
        this.projectBlocks = [];

        const SpriteMorph = this.snapAdapter.top.SpriteMorph;
        const BlockMorph = this.snapAdapter.top.BlockMorph;
        const HatBlockMorph = this.snapAdapter.top.HatBlockMorph;

        const objectWithScripts = this.snapAdapter.stage.children
            .filter(o => o instanceof SpriteMorph)
            .concat([this.snapAdapter.stage]);

        const allScriptsRoot = objectWithScripts
            .map(o => o.scripts.children.slice()).flat()
            .filter(b => b instanceof HatBlockMorph);

        const deadScriptsRoot = objectWithScripts
            .map(o => o.scripts.children.slice()).flat()
            .filter(b => !(b instanceof HatBlockMorph));

        const deadScriptsObject = {projectBlocks: []};

        const traverse = function (node) {
            if (node instanceof BlockMorph) {
                if (!(node instanceof HatBlockMorph)) {
                    // this.projectBlocks.add(this._boundsAsId(node.bounds));
                    // use the line below for debugging
                    this.projectBlocks.push(node);
                }
                if (node.isCustomBlock && node.definition.body) {
                    traverse.bind(this)(node.definition.body.expression);
                }
            }
            node.children.forEach(n => traverse.bind(this)(n));
        };

        allScriptsRoot.forEach(r => traverse.bind(this)(r));
        deadScriptsRoot.forEach(r => traverse.bind(deadScriptsObject)(r));
        this.deadCodeSize = deadScriptsObject.projectBlocks.length;
    }

    getValidBlockNumber () {
        return this.projectBlocks.length;
    }

    getDeadBlockNumber () {
        return this.deadCodeSize;
    }

    getCoverageRatio () {
        // return this.coveredBlocks.size / this.projectBlocks.size;
        // use the line below for debugging
        return this.coveredBlocks.size / this.projectBlocks.length;
    }

    reset () {
        this.trace = [];
        // this.projectBlocks.clear();
        // use the line below for debugging
        this.projectBlocks = [];
        this.coveredBlocks.clear();
    }

}
module.exports = Instrumenter;
