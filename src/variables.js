class Variables {

    constructor (snapAdapter) {
        /**
         * @type{SnapAdapter}
         */
        this.snapAdapter = snapAdapter;

    }

    get stageVariables () {
        return  this.snapAdapter.ide.globalVariables.vars;
    }

    getFirstVariableValue(){
        let allValues = Object.keys(this.stageVariables)
            .map(v => ({
                name: v,
                value: this.stageVariables[v].value
            }));
        return allValues[0]
    }






}
module.exports = Variables;
