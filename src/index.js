const {$} = require('./web-libs');
const _ = require('lodash');
// const Sprites = require('./sprites');
const SnapAdapter = require('./snap-adapter');
const TestController = require('./test-controller');

window.$ = $;

const Grab = window.Grab = {};
Grab.stat = {};

Grab.testSet = [
    {
        duration: 7500,
        triggerSwitches: {
            randomDirection: false,
            upKey: true
        },
        stepRequirement: 100
    },
    {
        duration: 7500,
        triggerSwitches: {
            randomDirection: false,
            downKey: true
        },
        stepRequirement: 100
    },
    {
        duration: 35000,
        triggerSwitches: {
            followBall: true,
            randomDirection: false,
            ballTouchPaddleStopFollow: true,
            ballTouchRightEdgeStartFollow: true,
            testSpaceBallMove: false
        },
        stepRequirement: 1000
    },
    {
        duration: 20000,
        stepRequirement: 1000
    },
    {
        duration: 20000,
        stepRequirement: 1000
    }
];

//Grab.coverageRequirement = 0.7;

const snapFrame = document.getElementsByTagName('iframe')[0];

const serverUrl = 'http://localhost:3000';

const getProjectList = async function () {
    const projectList = await Promise.resolve($.get(`${serverUrl}/project_list`));
    return projectList;
};

const getTests = async function () {
    const tests = await Promise.resolve($.get({
        url: `${serverUrl}/test_script/`,
        dataType: 'text'
    }));
    return tests;
};

const loadTriggers = function (tests, addOnStart = null) {

    Grab.testController = new TestController(Grab.snapAdapter);
    // eslint-disable-next-line no-eval
    const testScript = eval(tests);
    Grab.testController.triggers = testScript.triggers;
    Grab.testNames = testScript.testNames;
    // Grab.testController.triggers
    //     .filter(tr => tr.reportInStatistics).map(tr => tr.name);

    if (addOnStart !== null) {
        Grab.testController.triggers.forEach(tr => {
            if (tr.name in addOnStart) {
                tr.addOnStart = addOnStart[tr.name];
                console.log(tr.name);
                console.log(addOnStart[tr.name]);
            }
        });
    }
    Grab.testController.triggers.filter(tr => tr.addOnStart).forEach(
        tr => Grab.snapAdapter.stepper.addTrigger(Grab.testController.bindTrigger(tr))
    );
};

const getProject = async function () {

    const projectName = Grab.currentProjectName;
    const projectXML = await Promise.resolve($.get({
        url: `${serverUrl}/project_file/${projectName}`,
        dataType: 'text'
    }));

    return projectXML;
};


const loadProject = function (projectString) {

    Grab.snapAdapter.loadProject(projectString);

    console.log(Grab.snapAdapter.stage);
};
const loadOnce = async function (projectName = '30_8.xml') {

    Grab.currentProjectName = projectName;
    const projectXML = await getProject();
    const tests = await getTests();
    Grab.snapAdapter.reset();
    loadProject(projectXML);
    loadTriggers(tests);

};

const run = function () {
    Grab.snapAdapter.top.StageMorph.prototype.enablePenLogging = true;
    Grab.snapAdapter.stepper.run();
};

const sendTestResult = async function (singleRun) {
    
    // For single run
    if (singleRun) {
        const stat = {};
        for (const test of Grab.testNames) {
            stat[test] = {success: 0, fail: 0};
        }
        for (const item of Grab.testController.statistics) {
        // console.log(item.name);
            stat[item.name][item.status ? 'success' : 'fail']++;
        }
        Grab.stat = stat;
    }
    
    
    console.log(Grab.stat);
    await $.post(`${serverUrl}/save_test_result/`, {
        projectName: Grab.currentProjectName,
        stat: Grab.stat
    }).promise();
};

const sendTrace = async function (coverage) {
    const i = 0;
    await $.post(`${serverUrl}/save_trace/${i}`, {
        projectName: Grab.currentProjectName,
        coverage: coverage,
        trace: JSON.stringify(Grab.snapAdapter.trace)
    }).promise();
};

const stop = function () {
    Grab.snapAdapter.stepper.stop();
};


const gradeAll = async function () {
    Grab.projectList = await getProjectList();
    for (let i = 0; i < Grab.projectList.length; i++) {
        const currentProjectName = Grab.projectList[i];
        Grab.currentProjectName = currentProjectName;
        console.log(currentProjectName);
        const projectXML = await getProject();
        const tests = await getTests();
        let coverage = 0;
              
        loadTriggers(tests);
        for (const test of Grab.testNames) {
            Grab.stat[test] = {success: 0, fail: 0};
        }

        for (let j = 0; j < Grab.testSet.length;) {
            Grab.snapAdapter.reset();
            loadProject(projectXML);
            loadTriggers(tests, Grab.testSet[j].triggerSwitches);
            const durationNow = Grab.testSet[j].duration;
            run();
            await new Promise(r => setTimeout(r, durationNow));
            stop();
            const coverageNow = Grab.snapAdapter.instrumenter.getCoverageRatio();
            console.log(coverage);
            coverage = Math.max(coverage, coverageNow);

            for (const item of Grab.testController.statistics) {
                // console.log(item.name);
                Grab.stat[item.name][item.status ? 'success' : 'fail']++;
            }
            if (Grab.snapAdapter.stepper.stepCount > Grab.testSet[j].stepRequirement) {
                j++;
            }
            // console.log(Grab.snapAdapter.stepper.stepCount);
            // console.log(`timeoutN:${timeoutN}`);
        }
        await sendTestResult();
        await sendTrace(coverage);
    }

};

snapFrame.onload = function () {
    Grab.snapAdapter = new SnapAdapter(this.contentWindow);

};
$('#grade-all').on('click', gradeAll);
$('#load').on('click', () => loadOnce());
$('#run').on('click', run);
$('#stop').on('click', () => {
    stop();
    sendTestResult(true);
    sendTrace(0);
});
