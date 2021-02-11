const {_Triggeru, Callback} = require('./trigger');

class Stepper {

    constructor (snapAdapter) {
        /**
         * @type {SnapAdapter}
         */
        this.snapAdapter = snapAdapter;

        /**
         * @type {Trigger[]}
         */
        this.triggers = [];

        /**
         * @type {Boolean}
         */
        this.running = false;

        /**
         * @type{number}
         */
        this.stepCount = 0;

        /**
         * @type {Callback[]}
         */
        this._callbacks = [];

        /**
         * @type {number}
         */
        this._stepDuration = 50;


    }

    reset () {
        this.clearTriggers();
        this.running = false;
        this.stepCount = 0;
    }

    addTrigger (trigger) {
        this.triggers.unshift(trigger);
    }

    removeTriggerByName (name) {
        this.triggers.filter(t => t.name === name).forEach(t => t.withdraw());
    }

    clearTriggers () {
        this.triggers = [];
        this._callbacks = [];
    }

    async run () {
        if (!this.snapAdapter.projectStarted) {
            await this.snapAdapter.start();
        }
        this.running = true;
        this.snapAdapter.state.update();

    }

    stop () {
        console.log('stop stepper');
        this.running = false;
    }

    step () {

        this.stepCount++;
        // console.log('this.stepCount: ', this.stepCount);
        // console.log('this.snapAdapter.trace.length: ', this.snapAdapter.trace.length);
        // console.log('this.snapAdapter.coveredBlocks', this.snapAdapter.instrumenter.coveredBlocks);
        // console.log(this.triggers);

        this.triggers.forEach(t => {
            t._precondition = t.precondition();
        });

        // firing triggers are those whose callback will be added
        const firingTriggers = this.triggers
            .filter(t => t.active)
            // either it is a regular trigger and precondition is satisfied
            // or it is debounced trigger at trailling edge
            .filter(t => (!t.debounce && t._precondition) ||
                (t.debounce && t._continuing && !t._precondition));

        // save states for triggers
        this.triggers.filter(t => t.active)
            // either it is a firing regular trigger
            // or a debounced trigger at leading edge
            .filter(t => (!t.debounce && t._precondition) ||
                (t.debounce && !t._continuing && t._precondition))
            .forEach(t => {
                t._savedState = t.stateSaver();
            });

        // set continuing status for all triggers
        this.triggers.forEach(t => {
            t._continuing = t._precondition;
        });

        // get the callbacks of these triggers
        const callbacks = firingTriggers
            .map(t => {
                t.deactivate();
                t._callback = new Callback(
                    t._savedState,
                    t.delay,
                    t.callback,
                    t);
                return t._callback;
            });
        // add all activated callbacks to the callback queues
        this._callbacks.unshift(...callbacks);

        // console.log('this._callbacks: ', this._callbacks);

        // fire callback if delay reaches 0
        this._callbacks.forEach(c => c.countdown());

        // cleanup callbacks and triggers that are no longer alive
        this._callbacks = this._callbacks.filter(c => c.alive);
        this.triggers = this.triggers.filter(t => t.alive);

        this.snapAdapter.inputs.tick();

        /* this.snapAdapter.resume();
        return new Promise(resolve =>
            setTimeout(() => {
                this.snapAdapter.pause();
                this.snapAdapter.state.update();

                resolve(this.STEP_FINISHED);
            }, this._stepDuration)
        );*/
    }

    static get STEP_FINISHED () {
        return 'step_done';
    }
}

module.exports = Stepper;
