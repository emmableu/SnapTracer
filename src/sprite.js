class Sprite {

    constructor (snapAdapter, sprite) {
        /**
         * @type{SpriteMorph}
         */
        this.snapAdapter = snapAdapter;
        this.sprite = sprite;
    }

    get name (){
        return this.sprite.name;
    }

    get posX (){
        return this.sprite.xPosition();
    }

    get posY () {
        return this.sprite.yPosition();
    }

    get size (){
        return this.sprite.size;
    }

    get dir (){
        return this.sprite.direction();
    }

    radians(degrees) {
        return degrees * Math.PI / 180;
    }


    get dirX (){
        return Math.cos(this.radians(this.dir - 90));
    }

    get dirY (){
        return Math.sin(this.radians(this.dir - 90));
    }

    get touching (){
        return this.snapAdapter.stage.children
            .filter(c => (c !== this.sprite))
            .filter(c => (c instanceof this.snapAdapter.top.SpriteMorph))
            .filter(c => this.sprite.isTouching(c))
            .map(c => c.name);
    }

    get variables (){
        return _.cloneDeep(this.sprite.variables.vars);
    }

    get edges_touched () {
        let padding = 10,
            fb = this.sprite.nestingBounds(),
            stage = this.snapAdapter.stage,
            edges_touched = [];

        if (fb.left() < stage.left() + padding) {
            edges_touched.push('left');
        }
        if (fb.right() > stage.right() - padding) {
            edges_touched.push('right');
        }
        if (fb.top() < stage.top() - padding) {
            edges_touched.push('up');
        }
        if (fb.bottom() > stage.bottom() + padding) {
            edges_touched.push('bottom');
        }
        return edges_touched

    }









}
module.exports = Sprite;
