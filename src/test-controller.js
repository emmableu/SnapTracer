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
    }

    get keysDown () {
        return this.snapAdapter.inputs.keysDown;
    }
}
module.exports = TestController;
