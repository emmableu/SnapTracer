const {$} = require('./web-libs');
const {extend} = require('./isnap-util.js');

// snapAdapter = require('./snap-adapter');
window.$ = $;

const Grab = window.Grab = {};

const snapFrame = document.getElementsByTagName("iframe")[0];

const serverUrl = 'http://localhost:3000';
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

    Grab.trace = [];
    Grab.ide.pressStart();
    await new Promise(resolve =>
                        setTimeout(() => { 
                        Grab.ide.stopAllScripts()
                            resolve(true)
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

    extend(Grab.top.Process, 'evaluateBlock', 
        function (base, block, argCount) {
            const sprite = this.context.receiver;
            Grab.trace.push({
                sprite: { 
                    name: sprite.name,
                    x: sprite.xPosition(),
                    y: sprite.yPosition(),
                    size: sprite.size,
                    direction: sprite.direction(),
                }
            });
            base.call(this, block, argCount);
    })
}
$('#run').on('click', loadAndRun);
$('#step').on('click', step);