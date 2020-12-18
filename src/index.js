const {$} = require('./web-libs');
const _ = require('lodash');
const hash = require('object-hash');
const {extend} = require('./isnap-util.js');


// snapAdapter = require('./snap-adapter');
window.$ = $;

const Grab = window.Grab = {};

const snapFrame = document.getElementsByTagName("iframe")[0];

const serverUrl = 'http://localhost:3000';

const fireKey = function(key)
{
    Grab.ide.stage.fireKeyEvent(key);
    setTimeout(() => Grab.ide.stage.removePressedKey(key), 
                _.random(20,60));
}

const loadAndRun = async function()
{
    const currentProjectName = "pong.xml";
    const i = 0;
    snapFrame.contentWindow.focus();
    const project = await Promise.resolve($.get({
        url: `${serverUrl}/scratch_project/${currentProjectName}`,
        dataType: 'text'
    }));

    Grab.ide.rawOpenProjectString(project);
    Grab.ide.toggleAppMode(true);

    console.log(Grab.ide.stage);

    Grab.startTime = Date.now();
    Grab.trace = [];
    Grab.randomInput = setInterval(
        () => {
            const toss = _.random(-1, 1);
            if (toss < 0) {
                fireKey('left arrow');
            } else if (toss > 0) {
                fireKey('right arrow');
            }
        }, 100)
    Grab.ide.pressStart();
    await new Promise(resolve =>
                        setTimeout(() => { 
                        Grab.ide.stopAllScripts();
                        clearInterval(Grab.randomInput);
                        resolve(true);
                        }, 3000)
                     );
    await $.post(`${serverUrl}/save_trace/${i}`, {
        testName: currentProjectName,
        coverage: 0,
        trace: JSON.stringify(Grab.trace)
    });
    /*ide.nextSteps([
        () => ide.rawOpenProjectString(project),
        () => ide.toggleAppMode(true),
        () => ide.pressStart()
    ]);*/
}

const step = function()
{
    Grab.ide.stage.step();
    // console.log(Grab.ide.stage.children[2].variables.owner instanceof Grab.top.SpriteMorph);
    // => true
    // console.log(Grab.ide.stage.children[2] instanceof Grab.top.SpriteMorph);
    // => true 
    
}

snapFrame.onload = function()
{
    Grab.top = this.contentWindow;
    Grab.world = Grab.top.world;
    Grab.ide = Grab.world.children[0];
    Grab.ide.toggleAppMode(true);
    Grab.hash = hash;

    extend(Grab.top.Process, 'evaluateBlock', 
        function (base, block, argCount) {
            const sprite = this.context.receiver;
            const stage = Grab.ide.stage;
            Grab.trace.push({
                clockTime: ((Date.now() - Grab.startTime)/1000).toFixed(3),
                sprite: { 
                    name: sprite.name,
                    x: sprite.xPosition(),
                    y: sprite.yPosition(),
                    size: sprite.size,
                    direction: sprite.direction(),
                    touching: stage.children
                                   .filter(c => (c != sprite))
                                   .filter(c => (c instanceof Grab.top.SpriteMorph))
                                   .filter(c => sprite.isTouching(c)).map(c => c.name),
                    variables: _.cloneDeep(sprite.variables.vars),
                },
                // TODO: convert to array of keys which maps to true
                keysDown: _.cloneDeep(stage.keysPressed),
                stageVariables: _.cloneDeep(stage.variables.vars),
            });
            base.call(this, block, argCount);
    })
}
$('#run').on('click', loadAndRun);
//$('#step').on('click', step);