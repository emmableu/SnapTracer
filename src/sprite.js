class Cache {
    constructor () {
        this.cache = [];
    }
    get cur () {
        return this.cache[1];
    }
    get old () {
        return this.cache[0];
    }
    push (newData) {
        if (this.cache.length === 2) {
            this.cache.shift();
        }
        this.cache.push(newData);
    }
}


class Sprite {

    constructor (snapAdapter, sprite) {
        /**
         * @type{SpriteMorph}
         */
        this.snapAdapter = snapAdapter;
        this.sprite = sprite;
        this.cache = {
            posX: new Cache(),
            posY: new Cache(),
            size: new Cache(),
            dir: new Cache(),
            dirX: new Cache(),
            dirY: new Cache(),
            touching: new Cache(),
            variables: new Cache(),
            edgesTouched: new Cache()
        };
    }

    radians (degrees) {
        return degrees * Math.PI / 180;
    }

    updateCache () {

        this.cache.posX.push(this.sprite.xPosition());
        this.cache.posY.push(this.sprite.yPosition());
        this.cache.size.push(this.sprite.size);
        this.cache.dir.push(this.sprite.direction());
        this.cache.dirX.push(Math.cos(this.radians(this.sprite.direction() - 90)));
        this.cache.dirY.push(Math.sin(this.radians(this.sprite.direction() - 90)));
        this.cache.touching.push(this.calcTouching());
        this.cache.variables.push(_.cloneDeep(this.sprite.variables.vars));
        this.cache.edgesTouched.push(this.calcEdgesTouched());

    }

    get name (){
        return this.sprite.name;
    }

    get posX (){
        return this.cache.posX.cur;
    }

    get posXOld (){
        return this.cache.posX.old;
    }

    get posY () {
        return this.cache.posY.cur;
    }

    get posYOld () {
        return this.cache.posY.old;
    }

    get size (){
        return this.cache.size.cur;
    }

    get sizeOld (){
        return this.cache.size.old;
    }

    get dir (){
        return this.cache.dir.cur;
    }

    get dirOld (){
        return this.cache.dir.old;
    }

    get dirX (){
        return this.cache.dirX.cur;
    }

    get dirXOld (){
        return this.cache.dirX.old;
    }

    get dirY (){
        return this.cache.dirY.cur;
    }
    get dirYOld (){
        return this.cache.dirY.old;
    }

    get touching (){
        return this.cache.touching.cur;
    }

    get touchingOld (){
        return this.cache.touching.old;
    }

    calcTouching (){
        return this.snapAdapter.stage.children
            .filter(c => (c !== this.sprite))
            .filter(c => (c instanceof this.snapAdapter.top.SpriteMorph))
            .filter(c => this.sprite.isTouching(c))
            .map(c => c.name);
    }

    get variables (){
        return this.cache.variables.cur;
    }
    get variablesOld (){
        return this.cache.variables.old;
    }

    get edgesTouched (){
        return this.cache.edgesTouched.cur;
    }

    get edgesTouchedOld (){
        return this.cache.edgesTouched.old;
    }

    calcEdgesTouched () {
        const padding = 10;
        const fb = this.sprite.nestingBounds();
        const stage = this.snapAdapter.stage;
        const edgesTouched = [];

        if (fb.left() < stage.left() + padding) {
            edgesTouched.push('left');
        }
        if (fb.right() > stage.right() - padding) {
            edgesTouched.push('right');
        }
        if (fb.top() < stage.top() - padding) {
            edgesTouched.push('up');
        }
        if (fb.bottom() > stage.bottom() + padding) {
            edgesTouched.push('bottom');
        }
        return edgesTouched;
    }

}
module.exports = Sprite;
