const {Trigger} = require('./trigger');
const _ = require('lodash');
class TestController {

    constructor (snapAdapter) {

        /**
         * @type {SnapAdapter}
         */
        this.snapAdapter = snapAdapter;

        this.addTrigger = this.snapAdapter.stepper.addTrigger.bind(this.snapAdapter.stepper);
        this.removeTriggerByName = this.snapAdapter.stepper.removeTriggerByName.bind(this.snapAdapter.stepper);
        this.clearTriggers = this.snapAdapter.stepper.clearTriggers.bind(this.snapAdapter.stepper);
        this.state = this.snapAdapter.state;
        // this.getSpriteByName = this.snapAdapter.state.getSpriteByName
        //     .bind(this.snapAdapter.state);
        //the above should be deleted because the function does not update itself when the state gets updated.
        this.spriteIsTouching = this.snapAdapter.state.spriteIsTouching.bind(this.snapAdapter.state);
        this.spriteIsOnEdge = this.snapAdapter.state.spriteIsOnEdge.bind(this.snapAdapter.state);
        this.isKeyDown = this.snapAdapter.inputs.isKeyDown.bind(this.snapAdapter.inputs);
        this.inputKey = this.snapAdapter.inputs.inputKey.bind(this.snapAdapter.inputs);
        this.getFirstVariableValue = this.snapAdapter.state.getFirstVariableValue
            .bind(this.snapAdapter.state);

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
            tr.name,
            tr.precondition.bind(null, this),
            tr.callback.bind(null, this),
            tr.stateSaver.bind(null, this),
            tr.delay,
            tr.once,
            tr.debounce
        );
    }

    addTriggerByName (name) {
        this.addTrigger(this.getTriggerByName(name));
    }

    getTriggerByName (name) {
        const tr = this.triggers.find(tri => tri.name === name);
        return this.bindTrigger(tr);
    }

    newTrigger (
        name, precondition, callback,
        // eslint-disable-next-line no-unused-vars
        stateSaver = t => null,
        delay = 0, once = true, debounce = false
    ) {
        return new Trigger(
            name,
            precondition.bind(null, this),
            callback.bind(null, this),
            stateSaver.bind(null, this), delay, once, debounce
        );
    }

    get keysDown () {
        return this.snapAdapter.inputs.keysDown;
    }
}
module.exports = TestController;
