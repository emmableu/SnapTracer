const {$} = require('./web-libs');
const _ = require('lodash');
const SnapAdapter = require('./snap-adapter.js');

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

const loadAndRun = async function () {
    const currentProjectName = 'pong.xml';
    const i = 0;
    snapFrame.contentWindow.focus();
    const project = await Promise.resolve($.get({
        url: `${serverUrl}/scratch_project/${currentProjectName}`,
        dataType: 'text'
    }));
    Grab.snapAdapter.loadProject(project);

    console.log(Grab.snapAdapter.stage);

    
    Grab.randomInput = setInterval(
        () => {
            const toss = _.random(-1, 1);
            if (toss < 0) {
                fireKey('left arrow');
            } else if (toss > 0) {
                fireKey('right arrow');
            }
        }, 100);
    
    Grab.snapAdapter.start();
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
};

// Not in Use
const _stepu = async function () {
    //Grab.ide.stage.step();
    // console.log(Grab.ide.stage.children[2].variables.owner instanceof Grab.top.SpriteMorph);
    // => true
    // console.log(Grab.ide.stage.children[2] instanceof Grab.top.SpriteMorph);
    // => true

    Grab.ide.stage.resumeAll();
    await new Promise(resolve =>
        setTimeout(() => {
            Grab.ide.stage.pauseAll();
            resolve(true);
        }, 1000)
    );
    
};

snapFrame.onload = function () {
    Grab.snapAdapter = new SnapAdapter(this.contentWindow);
};
$('#run').on('click', loadAndRun);
// $('#step').on('click', step);
