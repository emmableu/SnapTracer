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
    }

    /**
     * Initialize the instrumenter
     * Heads-up: Do not call it more than once
     * as it extends the Process.prototype.evaluateBlock
     */
    init () {

        this.trace = [];
        const that = this;

        extend(this.snapAdapter.top.Process, 'evaluateBlock',
            function (base, block, argCount) {
                const sprite = this.context.receiver;
                const stageVariables = that.snapAdapter.ide.globalVariables.vars;
                //that.coveredBlocks.add(that._boundsAsId(block.bounds));
                // use the line below for debugging
                that.coveredBlocks.add(block);
                that.trace.push({
                    clockTime: ((Date.now() - that.snapAdapter.startTime) / 1000).toFixed(3),
                    sprite: {
                        name: sprite.name,
                        x: sprite.xPosition(),
                        y: sprite.yPosition(),
                        size: sprite.size,
                        direction: sprite.direction(),
                        touching: that.snapAdapter.stage.children
                            .filter(c => (c !== sprite))
                            .filter(c => (c instanceof that.snapAdapter.top.SpriteMorph))
                            .filter(c => sprite.isTouching(c))
                            .map(c => c.name),
                        variables: _.cloneDeep(sprite.variables.vars)
                    },
                    // TODO: convert to array of keys which maps to true
                    keysDown: that.snapAdapter.inputs.keysDown, //_.cloneDeep(that.stage.keysPressed),
                    stageVariables: Object.keys(stageVariables)
                        .map(v => ({
                            name: v,
                            value: stageVariables[v].value
                        }))
                });
                base.call(this, block, argCount);
                // eslint-disable-next-line semi
            })


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
        
        this.projectBlocks.clear();
        // use the line below for debugging
        this.projectBlocks = [];

        const SpriteMorph = this.snapAdapter.top.SpriteMorph;
        const BlockMorph = this.snapAdapter.top.BlockMorph;
        const HatBlockMorph = this.snapAdapter.top.HatBlockMorph;

        const objectWithScripts = this.snapAdapter.stage.children
            .filter(o => o instanceof SpriteMorph)
            .concat([this.snapAdapter.stage]);

        const allScriptsRoot = objectWithScripts
            .map(o => o.allScripts()).flat()
            .filter(b => b instanceof HatBlockMorph);

        const traverse = function (node) {
            if (node instanceof BlockMorph) {
                if (!(node instanceof HatBlockMorph)) {
                    // this.projectBlocks.add(this._boundsAsId(node.bounds));
                    // use the line below for debugging
                    this.projectBlocks.push(node);
                }
                if (node.isCustomBlock) {
                    traverse.bind(this)(node.definition.body.expression);
                }
            }
            node.children.forEach(n => traverse.bind(this)(n));
        };

        allScriptsRoot.forEach(r => traverse.bind(this)(r));
    }

    getCoverageRatio () {
        // return this.coveredBlocks.size / this.projectBlocks.size;
        // use the line below for debugging
        return this.coveredBlocks.size / this.projectBlocks.length;
    }

    reset () {
        this.trace = [];
        this.projectBlocks.clear();
        this.coveredBlocks.clear();
    }

}
module.exports = Instrumenter;
