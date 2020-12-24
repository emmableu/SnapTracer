const {Trigger} = require('./trigger');
class TestController {

    constructor (snapAdapter) {

        /**
         * @type {SnapAdapter}
         */
        this.snapAdapter = snapAdapter;

        this.addTrigger = this.snapAdapter.stepper.addTrigger.bind(this.snapAdapter.stepper);
        this.clearTriggers = this.snapAdapter.stepper.clearTriggers.bind(this.snapAdapter.stepper);
        // this.getSpriteByName = this.snapAdapter.sprites.getSpriteByName.bind(this.snapAdapter.sprites);
        this.isKeyDown = this.snapAdapter.inputs.isKeyDown.bind(this.snapAdapter.inputs);
        this.inputKey = this.snapAdapter.inputs.inputKey.bind(this.snapAdapter.inputs);

        this.triggers = [];
    }

    getTriggerByName (name) {
        const tr = this.triggers.find(t => t.name === name);
        return new Trigger(
            tr.precondition.bind(null, this),
            tr.callback.bind(null, this),
            tr.stateSaver.bind(null, this),
            tr.delay,
            tr.once
        );
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
