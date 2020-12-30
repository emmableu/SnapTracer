const {Trigger} = require('./trigger');
const _ = require('lodash');
class TestController {

    constructor (snapAdapter) {

        /**
         * @type {SnapAdapter}
         */
        this.snapAdapter = snapAdapter;

        this.addTrigger = this.snapAdapter.stepper.addTrigger.bind(this.snapAdapter.stepper);
        this.clearTriggers = this.snapAdapter.stepper.clearTriggers.bind(this.snapAdapter.stepper);
        this.state = this.snapAdapter.state;
        this.getSpriteByName = this.snapAdapter.state.getSpriteByName
            .bind(this.snapAdapter.state);
        this.spriteIsTouching = this.snapAdapter.state.spriteIsTouching.bind(this.snapAdapter.state);
        this.spriteIsOnEdge = this.snapAdapter.state.spriteIsOnEdge.bind(this.snapAdapter.state);
        this.isKeyDown = this.snapAdapter.inputs.isKeyDown.bind(this.snapAdapter.inputs);
        this.inputKey = this.snapAdapter.inputs.inputKey.bind(this.snapAdapter.inputs);
        
        // temporary
        this.getFirstVariableValue = this.snapAdapter.variables.getFirstVariableValue
            .bind(this.snapAdapter.variables);

        this.random = _.random.bind(_);
        
        this.statistics = [];
        this.triggers = [];
    }

    clearStatistics () {
        this.statistics = [];
    }

    reportCase (testName, status, info) {
        this.statistics.push({name: testName, status: status, info: info});
    }

    bindTrigger (tr) {
        return new Trigger(
            tr.precondition.bind(null, this),
            tr.callback.bind(null, this),
            tr.stateSaver.bind(null, this),
            tr.delay,
            tr.once
        );
    }

    getTriggerByName (name) {
        const tr = this.triggers.find(tri => tri.name === name);
        return this.bindTrigger(tr);
    }
    // eslint-disable-next-line no-unused-vars
    newTrigger (precondition, callback, stateSaver = t => null, delay = 0, once = true) {
        return new Trigger(
            precondition.bind(null, this),
            callback.bind(null, this),
            stateSaver.bind(null, this), delay, once
        );
    }

    get keysDown () {
        return this.snapAdapter.inputs.keysDown;
    }
}
module.exports = TestController;
