class Input {
    
    constructor (id, timeout = 1, release = () => null) {

        this.id = id;

        this.timeout = timeout;

        /**
         * @type{()=>null} The callback for releasing the input.
         */
        this._release = release;

        /**
         * @type{boolean} Inactive inputs will be cleaned
         */
        this.active = true;
        
    }

    tick () {
        this.timeout--;
        if (this.timeout < 0) {
            this.release();
        }
    }

    release () {
        this.active = false;
        this._release();
    }
}

class Inputs {
    
    constructor (snapAdapter) {
        /**
         * @type{SnapAdapter}
         */
        this.snapAdapter = snapAdapter;
        /**
         * @type{Array<Input>}
         */
        this._inputs = [];

    }
    
    inputKey (key, duration) {
        this.snapAdapter.stage.fireKeyEvent(key);

        const keyInput = this._inputs.find(x => x.name === key);
        if (keyInput) {
            keyInput.timeout = duration;
        } else {
            this._inputs.push(new Input(
                key,
                duration,
                () => this.snapAdapter.stage.removePressedKey(key)
            ));
        }
    }

    tick () {
        this._inputs.forEach(x => x.tick());
        this._inputs = this._inputs.filter(x => x.active);
    }

    reset () {
        this._inputs.forEach(x => x.release());
        this._inputs = [];
    }

    isKeyDown (key) {
        return this.keysDown.includes(key);
    }

    get keysDown () {
        const keysPressed = this.snapAdapter.stage.keysPressed;
        return Object.keys(keysPressed).filter(k => keysPressed[k]);
    }

}
module.exports = Inputs;
