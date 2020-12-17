class SnapAdapter {

    /**
     * 
     * @param {WordMorph} world 
     */
    constructor(world) {
        this.world = world;
        this.ide = world.children[0];
    }
}

module.exports = SnapAdapter;