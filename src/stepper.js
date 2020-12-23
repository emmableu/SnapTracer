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
         * @type {Callback[]}
         */
        this._callbacks = [];

        /**
         * @type {()=>}
         */
        this._stopHandle = false;

        /**
         * @type {number}
         */
        this._stepDuration = 5;
        
    }

    addTrigger (trigger) {
        this.triggers.unshift(trigger);
    }

    async run () {
        if (!this.snapAdapter.projectStarted) {
            await this.snapAdapter.start();
        }
        this.running = true;
        while (this.running) {
            await this.step();
        }
        
    }

    stop () {
        console.log('stop stepper');
        // console.log(this._stopHandle);
        // this._stopHandle(this.STOP_SIGNAL);
        // this._stopHandle = null;
        this.running = false;
    }

    step () {

        // select triggers with precondition satisfied
        const firingTriggers = this.triggers.filter(t => t.active)
            .filter(t => t.precondition());
        // get the callbacks of these triggers
        const callbacks = firingTriggers
            .map(t => {
                t.deactivate();
                return new Callback(
                    t.stateSaver(), // save the current state
                    t.delay,
                    t.callback,
                    t);
            });
        // add all activated callbacks to the callback queues
        this._callbacks.unshift(...callbacks);

        // fire callback if delay reaches 0
        this._callbacks.forEach(c => c.countdown());

        // cleanup callbacks and triggers that are no longer alive
        this._callbacks = this._callbacks.filter(c => c.alive);
        this.triggers = this.triggers.filter(t => t.alive);
        this.snapAdapter.resume();
        return new Promise(resolve =>
            setTimeout(() => {
                this.snapAdapter.pause();
                resolve(this.STEP_FINISHED);
            }, this._stepDuration)
        );
    }
    
    static get STOP_SIGNAL () {
        return 'stop';
    }
    
    static get STEP_FINISHED () {
        return 'step_done';
    }
}

module.exports = Stepper;
