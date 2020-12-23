class Inputs {
    
    constructor (snapAdapter) {
        /**
         * @type{SnapAdapter}
         */
        this.snapAdapter = snapAdapter;

    }
    
    inputKey (key, duration) {
        this.snapAdapter.stage.fireKeyEvent(key);
        setTimeout(() => this.snapAdapter.stage.removePressedKey(key),
            duration);
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
