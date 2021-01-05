class Variables {

    constructor (snapAdapter) {
        /**
         * @type{SnapAdapter}
         */
        this.snapAdapter = snapAdapter;
        const allValues = Object.keys(this.stageVariables)
            .map(v => ({
                name: v,
                value: this.stageVariables[v].value
            }));
        this.firstVariable = allValues[0];


    }

    get stageVariables () {
        return this.snapAdapter.ide.globalVariables.vars;
    }

}
module.exports = Variables;
