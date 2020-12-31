class Trigger {

    constructor (name, pre, callback, stateSaver = () => null,
        delay = 0, once = true) {

        /**
         * The name identifier of the trigger
         * @type{String}
         */
        this.name = name;

        /**
         * The predicate function starts the trigger
         * @type{() => Boolean}
         */
        this.precondition = pre;

        /**
         * The callback function of this trigger
         * @type{(any) => } takes a parameter that can be used to store the old state
         */
        this.callback = callback;

        /**
         * Function to save the old state for the callback
         * @type{() => any}
         */
        this.stateSaver = stateSaver;

        /**
         * How long to delay fire the callback when precondition is satisfied
         * 0 means fire immediately
         * @type{number}
         */
        this.delay = delay;

        /**
         * whether the trigger is thrown out after callback fired
         * @type{Boolean}
         */
        this.once = once;

        /**
         * The pointer to the callback function in the queue
         * @type{Object}
         */
        this._callback = null;

        /**
         * Whether the precondition is checked at every step
         * to initiate the callback
         * @type{Boolean}
         */
        this._active = true;

        /**
         * Whether this trigger is still alive
         * Non-alive trigger will be discarded
         * @type{Boolean}
         * @private
         */
        this._alive = true;
    }

    activate () {
        this._active = true;
    }

    deactivate () {
        this._active = false;
    }

    /**
     * discard this trigger if it is one-timed,
     * reactivate it otherwise
     */
    recycle () {
        if (this.once) {
            this._alive = false;
        } else {
            this.activate();
        }
        this._callback = null;
    }

    /**
     * Tell its callback to abort if it is in the queue
     * and mark the trigger to be discarded
     */
    withdraw () {
        if (this._callback) {
            this._callback.abort();
        }
        this._alive = false;
    }
    /**
     * reset to alive and active
     */
    reset () {
        this._alive = true;
        this._active = true;
    }

    get active () {
        return this._active;
    }

    get alive () {
        return this._alive;
    }

    static get ALWAYS () {
        return () => true;
    }

    static get PASSIVE () {
        return () => false;
    }

}

class Callback {

    constructor (data, delay, callback, trigger) {

        this._data = data;
        this._delay = delay;
        this._callback = callback;
        this._trigger = trigger;
    }

    async call () {
        await Promise.resolve(this._callback(this._data));
        // _delay = -2 means no longer to be fired
        this._delay = -2;
        this._trigger.recycle();
    }

    /**
     * End the callback cycle without calling
     */
    abort () {
        this._delay = -2;
        this._trigger.recycle();
    }

    countdown () {
        // _delay = 0 means to fire in the nearest cycle
        this._delay--;
        if (this._delay === -1) {
            this.call();
        }
    }

    get alive () {
        return this._delay >= 0;
    }

}

module.exports = {Trigger, Callback};
