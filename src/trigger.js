class Trigger {

    constructor (pre, callback, stateSaver = () => null, delay = 0, once = true) {

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
         * @type{Boolean}
         * @private
         */
        this._active = true;

        /**
         * if this trigger is still alive
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

}

class Callback {

    constructor (data, delay, callback, trigger) {

        this._data = data;
        this._delay = delay;
        this._callback = callback;
        this._trigger = trigger;
    }

    call () {
        this._callback(this._data);
        this._delay = -1;
        this._trigger.recycle();
    }

    countdown () {
        // _delay = 0 means to fire in the nearest cycle
        this._delay--;
        if (this._delay < 0) {
            this.call();
        }
    }

    get alive () {
        return this._delay >= 0;
    }

    static get ALWAYS () {
        return () => true;
    }

}

module.exports = {Trigger, Callback};
