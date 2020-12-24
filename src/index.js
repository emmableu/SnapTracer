const {$} = require('./web-libs');
const _ = require('lodash');
// const Sprites = require('./sprites');
const SnapAdapter = require('./snap-adapter');
const TestController = require('./test-controller');
// const {Trigger} = require('./trigger.js');
// const Variables = require('./variables.js');

window.$ = $;

const Grab = window.Grab = {};

const snapFrame = document.getElementsByTagName('iframe')[0];

const serverUrl = 'http://localhost:3000';

// Not in used
const fireKey = function (key) {
    Grab.snapAdapter.stage.fireKeyEvent(key);
    setTimeout(() => Grab.snapAdapter.stage.removePressedKey(key),
        _.random(20, 60));
};

const load = async function () {
    Grab.currentProjectName = 'pong.xml';
    snapFrame.contentWindow.focus();

    Grab.testController = new TestController(Grab.snapAdapter);

    const project = await Promise.resolve($.get({
        url: `${serverUrl}/project_file/${Grab.currentProjectName}`,
        dataType: 'text'
    }));
    
    Grab.snapAdapter.loadProject(project);

    console.log(Grab.snapAdapter.stage);
    

    const tests = await Promise.resolve($.get({
        url: `${serverUrl}/test_script/`,
        dataType: 'text'
    }));
    // eslint-disable-next-line no-eval
    const testTriggers = eval(tests);

    testTriggers.forEach(
        tr => Grab.snapAdapter.stepper.addTrigger(Grab.testController.bindTrigger(tr))
    );
    console.log(Grab.snapAdapter.stepper.triggers);
    //Grab.snapAdapter.start();
    /*
    await new Promise(resolve =>
        setTimeout(() => {
            Grab.snapAdapter.end();
            clearInterval(Grab.randomInput);
            resolve(true);
        }, 3000)
    );
    */

    /*
    const sprites = Grab.snapAdapter.sprites;
    const paddle = sprites.getSpriteByName('paddle');
    const ball = sprites.getSpriteByName('ball');
    const variables = Grab.snapAdapter.variables;

    // const paddle = Grab.snapAdapter.stage.children[1];
    Grab.snapAdapter.stepper.addTrigger(
        new Trigger(() => Grab.snapAdapter.inputs.isKeyDown('down arrow'),
            paddleOldY => {
                if (paddle.posY < paddleOldY.val) {
                    console.log('------');
                    console.log(paddleOldY.time);
                    console.log(Date.now());
                    console.log('Paddle moves down');
                } else {
                    console.log('------');
                    console.log(paddleOldY.time);
                    console.log(Date.now());
                    console.log(paddle.posY);
                    console.log(paddleOldY.val);
                    console.log('Not moving down!');
                }
            },
            () => ({val: paddle.posY, time: Date.now()}),
            50,
            false)
    );
    Grab.snapAdapter.stepper.addTrigger(
        new Trigger(() => Grab.snapAdapter.inputs.isKeyDown('up arrow'),
            paddleOldY => {
                if (paddle.posY > paddleOldY.val) {
                    console.log('------');
                    console.log(paddleOldY.time);
                    console.log(Date.now());
                    console.log('Paddle moves up');
                } else {
                    console.log('------');
                    console.log(paddleOldY.time);
                    console.log(Date.now());
                    console.log(paddle.posY);
                    console.log(paddleOldY.val);
                    console.log('Not moving up!');
                }
            },
            () => ({val: paddle.posY, time: Date.now()}),
            5,
            false)
    );

    Grab.snapAdapter.stepper.addTrigger(
        new Trigger(() => Grab.snapAdapter.sprites.isTouching('paddle', 'ball'),
            ballOldDir => {
                if (ball.dir !== ballOldDir.val) {
                    console.log('------');
                    console.log(ballOldDir.time);
                    console.log(Date.now());
                    console.log('Ball turns on touching paddle');
                } else {
                    console.log('------');
                    console.log(ballOldDir.time);
                    console.log(Date.now());
                    console.log(ball.dir);
                    console.log(ballOldDir.val);
                    console.log('Ball does not turn on touching paddle!');
                }
            },
            () => ({val: ball.dir, time: Date.now()}),
            5,
            false)
    );


    Grab.snapAdapter.stepper.addTrigger(
        new Trigger(() => Grab.snapAdapter.sprites.isTouching('paddle', 'ball'),
            varOldVal => {
                if (variables.getFirstVariableValue() !== varOldVal.val) {
                    console.log('------');
                    console.log(varOldVal.time);
                    console.log(Date.now());
                    console.log('variable value changed');
                } else {
                    console.log('------');
                    console.log(varOldVal.time);
                    console.log(Date.now());
                    console.log(ball.dir);
                    console.log(varOldVal.val);
                    console.log('variable value did not change!');
                }
            },
            () => ({val: (variables.getFirstVariableValue()), time: Date.now()}),
            5,
            false)
    );


    Grab.snapAdapter.stepper.addTrigger(
        new Trigger(() => Grab.snapAdapter.sprites.isOnEdge('ball', ['left', 'up', 'bottom']),
            ballOldDir => {
                if (ball.dir !== ballOldDir.val) {
                    console.log('------');
                    console.log(ballOldDir.time);
                    console.log(Date.now());
                    console.log('Ball turns on edge');
                } else {
                    console.log('------');
                    console.log(ballOldDir.time);
                    console.log(Date.now());
                    console.log(ball.dir);
                    console.log(ballOldDir.val);
                    console.log('Ball does not turn on touching edge!');
                }
            },
            () => ({val: ball.dir, time: Date.now()}),
            5,
            false)
    );


    Grab.snapAdapter.stepper.addTrigger(
        new Trigger(() => Grab.snapAdapter.sprites.isOnEdge('ball', ['right']),
            varOldVal => {
                if (variables.getFirstVariableValue() !== varOldVal.val) {
                    console.log('------');
                    console.log(varOldVal.time);
                    console.log(Date.now());
                    console.log('variable value changed');
                } else {
                    console.log('------');
                    console.log(varOldVal.time);
                    console.log(Date.now());
                    console.log(ball.dir);
                    console.log(varOldVal.val);
                    console.log('variable value did not change!');
                }
            },
            () => ({val: (variables.getFirstVariableValue()), time: Date.now()}),
            5,
            false)
    );
    */

};

const run = function () {
    /*Grab.randomInput = setInterval(
        () => {
            const toss = _.random(-1, 1);
            if (toss < 0) {
                fireKey('left arrow');
            } else if (toss > 0) {
                fireKey('right arrow');
            }
        }, 100);*/

    //Grab.snapAdapter.projectStarted = true;
    //Grab.snapAdapter.start();
    Grab.snapAdapter.stepper.run();
};

// Not in Use
const stop = async function () {
    //Grab.ide.stage.step();
    // console.log(Grab.ide.stage.children[2].variables.owner instanceof Grab.top.SpriteMorph);
    // => true
    // console.log(Grab.ide.stage.children[2] instanceof Grab.top.SpriteMorph);
    // => true

    Grab.snapAdapter.stepper.stop();
    // clearInterval(Grab.randomInput);
    // Grab.snapAdapter.resume();

    const i = 0;
    await $.post(`${serverUrl}/save_trace/${i}`, {
        testName: Grab.currentProjectName,
        coverage: 0,
        trace: JSON.stringify(Grab.snapAdapter.trace)
    });
    // Grab.testController.statistics
};

snapFrame.onload = function () {
    Grab.snapAdapter = new SnapAdapter(this.contentWindow);

};
$('#load').on('click', load);
$('#run').on('click', run);
$('#stop').on('click', stop);
