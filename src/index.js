const {$} = require('./web-libs');
const _ = require('lodash');
const SnapAdapter = require('./snap-adapter.js');
const {Trigger} = require('./trigger.js');

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
    Grab.currentProjectName = 'pong_no_left.xml';
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

    
    const paddle = Grab.snapAdapter.stage.children[1];
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
            () => ({val: paddle.xPosition(), time: Date.now()}),
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
            () => ({val: paddle.xPosition(), time: Date.now()}),
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
