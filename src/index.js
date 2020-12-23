const {$} = require('./web-libs');
const _ = require('lodash');
const Sprites = require('./sprites');
const SnapAdapter = require('./snap-adapter.js');
const {Trigger} = require('./trigger.js');
const Variables = require('./variables.js');

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

    const project = await Promise.resolve($.get({
        url: `${serverUrl}/scratch_project/${Grab.currentProjectName}`,
        dataType: 'text'
    }));

    Grab.snapAdapter.loadProject(project);
    /*
    await new Promise(resolve =>
        setTimeout(() => {
            resolve(true);
        }, 100)
    );
    */

    console.log(Grab.snapAdapter.stage);

    //Grab.snapAdapter.stepper.run();
    //Grab.snapAdapter.start();
    /*
    await new Promise(resolve =>
        setTimeout(() => {
            Grab.snapAdapter.end();
            clearInterval(Grab.randomInput);
            resolve(true);
        }, 3000)
    );
    await $.post(`${serverUrl}/save_trace/${i}`, {
        testName: currentProjectName,
        coverage: 0,
        trace: JSON.stringify(Grab.snapAdapter.trace)
    });
    */

    const sprites = Grab.snapAdapter.sprites;
    const paddle = sprites.getSpriteByName('paddle');
    const ball = sprites.getSpriteByName('ball');
    const variables = Grab.snapAdapter.variables;

    // const paddle = Grab.snapAdapter.stage.children[1];
    Grab.snapAdapter.stepper.addTrigger(
        new Trigger(() => Grab.snapAdapter.inputs.isKeyDown('left arrow'),
            paddleOldX => {
                if (paddle.xPosition() < paddleOldX.val) {
                    console.log('------');
                    console.log(paddleOldX.time);
                    console.log(Date.now());
                    console.log('Paddle moves left');
                } else {
                    console.log('------');
                    console.log(paddleOldX.time);
                    console.log(Date.now());
                    console.log(paddle.xPosition());
                    console.log(paddleOldX.val);
                    console.log('Not moving left!');
                }
            },
            () => ({val: paddle.posX, time: Date.now()}),
            5,
            false)
    );
    Grab.snapAdapter.stepper.addTrigger(
        new Trigger(() => Grab.snapAdapter.inputs.isKeyDown('right arrow'),
            paddleOldX => {
                if (paddle.xPosition() > paddleOldX.val) {
                    console.log('------');
                    console.log(paddleOldX.time);
                    console.log(Date.now());
                    console.log('Paddle moves right');
                } else {
                    console.log('------');
                    console.log(paddleOldX.time);
                    console.log(Date.now());
                    console.log(paddle.xPosition());
                    console.log(paddleOldX.val);
                    console.log('Not moving right!');
                }
            },
            () => ({val: paddle.posX(), time: Date.now()}),
            5,
            false)
    );

    Grab.snapAdapter.stepper.addTrigger(
        new Trigger(() => Grab.snapAdapter.sprites.isTouching('paddle', 'ball'),
            ballOldDir => {
                if (ball.direction() < ballOldDir.val) {
                    console.log('------');
                    console.log(ballOldDir.time);
                    console.log(Date.now());
                    console.log('Ball turns on touching paddle');
                } else {
                    console.log('------');
                    console.log(ballOldDir.time);
                    console.log(Date.now());
                    console.log(ball.direction());
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
                if (variables.getFirstVariableValue() < varOldVal.val) {
                    console.log('------');
                    console.log(varOldVal.time);
                    console.log(Date.now());
                    console.log('variable value changed');
                } else {
                    console.log('------');
                    console.log(varOldVal.time);
                    console.log(Date.now());
                    console.log(ball.direction());
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
                if (ball.direction() < ballOldDir.val) {
                    console.log('------');
                    console.log(ballOldDir.time);
                    console.log(Date.now());
                    console.log('Ball turns on edge');
                } else {
                    console.log('------');
                    console.log(ballOldDir.time);
                    console.log(Date.now());
                    console.log(ball.direction());
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
                if (variables.getFirstVariableValue() < varOldVal.val) {
                    console.log('------');
                    console.log(varOldVal.time);
                    console.log(Date.now());
                    console.log('variable value changed');
                } else {
                    console.log('------');
                    console.log(varOldVal.time);
                    console.log(Date.now());
                    console.log(ball.direction());
                    console.log(varOldVal.val);
                    console.log('variable value did not change!');
                }
            },
            () => ({val: (variables.getFirstVariableValue()), time: Date.now()}),
            5,
            false)
    );

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
};

snapFrame.onload = function () {
    Grab.snapAdapter = new SnapAdapter(this.contentWindow);

};
$('#load').on('click', load);
$('#run').on('click', run);
$('#stop').on('click', stop);
