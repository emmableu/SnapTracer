// class State {
//     constructor () {
//         this.old = null;
//         this.cur = null;
//     }
//     get cur () {
//         return this.cur;
//     }
//     get old () {
//         return this.old;
//     }
//     push (newData) {
//         this.old = this.cur;
//         this.cur = newData;
//     }
// }
//






// eslint-disable-next-line no-unused-vars
class State {

    // oldSprites = newsprites.copy
    // newsprites.update
    //


    constructor () {
        this.spriteCache = {};
        this.stageVarCache = {};
        const allSprites = this.snapAdapter.top.world.children[0].sprites.contents;
        const spriteNames = allSprites.map(x => x.name);
        for (const n of spriteNames) {
            this.spriteCache[n] = {
                posX: new State(),
                posY: new State(),
                size: new State(),
                dir: new State(),
                dirX: new State(),
                dirY: new State(),
                touching: new State(),
                variables: new State(),
                edgesTouched: new State()
            };
        }
    }
}

module.exports = State;
