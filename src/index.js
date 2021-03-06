const {$} = require('./web-libs');
const _ = require('lodash');
const seedRandom = require('seedrandom');
const SnapAdapter = require('./snap-adapter');
const TestController = require('./test-controller');

window.$ = $;

const SnapCheck = window.SnapCheck = {};
SnapCheck.stat = {};

SnapCheck.lowConfidenceRetry = 1;

SnapCheck.inputSet = [
    {name: ['empty+space', 'upKey', 'threeSecStateUnchanged'],
        duration: '15000'},
    {name: ['empty+space', 'downKey', 'threeSecStateUnchanged'],
        duration: '15000'},
    {name: ['empty+space', 'followBall', 'threeSecStateUnchanged'],
        duration: '15000'},
    {name: ['empty+space', 'followBall', 'threeSecStateUnchanged'],
        duration: '15000'},
    {name: ['empty+space', 'randomDirection', 'threeSecStateUnchanged'],
        duration: '20000'},

    {name: ['empty+space', 'followBall', 'evadeBall', 'threeSecStateUnchanged'],
        duration: '15000'},

    {name: ['empty+space', 'followBall', 'evadeBall', 'threeSecStateUnchanged'],
        duration: '15000'},
    {name: ['empty+space', 'followBall', 'evadeBall', 'threeSecStateUnchanged'],
        duration: '15000'}

        ];
//SnapCheck.coverageRequirement = 0.7;

const snapFrame = document.getElementsByTagName('iframe')[0];

// // console.log('where am i????');

const serverUrl = 'http://localhost:3000';

const getProjectList = async function () {
    const projectList = await Promise.resolve($.get(`${serverUrl}/project_list`));
    return projectList;
};


const getProject = async function () {

    const projectName = SnapCheck.currentProjectName;
    const projectXML = await Promise.resolve($.get({
        url: `${serverUrl}/project_file/${projectName}`,
        dataType: 'text'
    }));

    return projectXML;
};


const loadProject = async function (projectString) {
    await SnapCheck.snapAdapter.loadProject(projectString);
    // // console.log('SnapCheck.snapAdapter.stage');
    // // console.log(SnapCheck.snapAdapter.stage);
};

const getInputs = async function () {
    // eslint-disable-next-line no-return-await
    return await Promise.resolve($.get({
        url: `${serverUrl}/test_script/`,
        dataType: 'text'
    }));
};

const loadInputTriggers = function (traceInputs) {
    SnapCheck.testController = new TestController(SnapCheck.snapAdapter);
    // eslint-disable-next-line no-eval
    const testScript = eval(traceInputs);
    SnapCheck.testController.triggers = testScript.triggers;
    // SnapCheck.testNames = testScript.testNames;
};


const addTriggersToStepper = function (curTrigger) {
    console.log('curTrigger.name: ', curTrigger.name);
    SnapCheck.testController.triggers.forEach(
        tr => {
            console.log(tr.name);
            if (curTrigger.name.includes(tr.name)) {
                SnapCheck.snapAdapter.stepper.addTrigger(SnapCheck.testController.bindTrigger(tr));
            }
        }
    );
    console.log('stepper triggers: ', SnapCheck.snapAdapter.stepper.triggers);
};


const run = function () {
    SnapCheck.snapAdapter.top.StageMorph.prototype.enablePenLogging = true;
    SnapCheck.snapAdapter.stepper.run();
};

const sendTestResult = async function (coverage, singleRun) {

    // For single run
    if (singleRun) {
        const stat = {};
        for (const test of SnapCheck.testNames) {
            stat[test] = {success: 0, fail: 0};
        }
        for (const item of SnapCheck.testController.statistics) {
        // // console.log(item.name);
            stat[item.name][item.status ? 'success' : 'fail']++;
        }
        SnapCheck.stat = stat;
    }

    // console.log(SnapCheck.stat);
    await $.post(`${serverUrl}/save_test_result/`, {
        projectName: SnapCheck.currentProjectName,
        stat: SnapCheck.stat,
        validBlocks: SnapCheck.snapAdapter.instrumenter.getValidBlockNumber(),
        deadBlocks: SnapCheck.snapAdapter.instrumenter.getDeadBlockNumber(),
        coverage: coverage
    }).promise();
};

const sendTrace = async function (coverage, i) {
    await $.post(`${serverUrl}/save_trace/${i}`, {
        projectName: SnapCheck.currentProjectName,
        coverage: coverage,
        trace: JSON.stringify(SnapCheck.snapAdapter.trace)
    }).promise();
};

const stop = function () {
    SnapCheck.snapAdapter.stepper.stop();
};

const exitCondition = (r, curDuration) => {
    console.log("SnapCheck.testController.statistics: ", SnapCheck.testController.statistics);
    const timeOutCall = setTimeout(r, curDuration);
    const myInterval= setInterval(()=> {
        const threeSecUnChangedStat = SnapCheck.testController.statistics.filter((r) => {
           return r.name === 'threeSecStateUnchanged'
        });

        // console.log('SnapCheck.stat[\'threeSecStateUnchanged\']: ', threeSecUnChangedStat);
        if (threeSecUnChangedStat.length > 0) {
            if (threeSecUnChangedStat[threeSecUnChangedStat.length - 1].status) {
                clearTimeout(timeOutCall);
                clearInterval(myInterval);
                r();
                console.log("interval and timeout cleared")
            }
        }
    }, 5000);

};

const traceAll = async function () {
    SnapCheck.projectList = await getProjectList();
    for (let i = 0; i < SnapCheck.projectList.length; i++) {
        console.log('i: ', i);
        const currentProjectName = SnapCheck.projectList[i];
        console.log('currentProjectName: ', currentProjectName);
        SnapCheck.currentProjectName = currentProjectName;



        const projectXML = await getProject();

        for (const [inputIndex, input] of SnapCheck.inputSet.entries()){
            const traceInputs = await getInputs();
            loadInputTriggers(traceInputs);
            let coverage = 0;
            console.log('----------------start loop  ', inputIndex,
                '  --------------------------------');
            console.log('input: ', input);
            await loadProject(projectXML);
            SnapCheck.snapAdapter.reset();
            console.log('SnapCheck.snapAdapter.state.spriteCache after reset: ', SnapCheck.snapAdapter.state.spriteCache.cur.data);
            addTriggersToStepper(input);
            console.log('SnapCheck.testController.triggers.: ', SnapCheck.testController.triggers);
            const curDuration = input.duration;
            console.log('start run: ', ((Date.now() - SnapCheck.snapAdapter.startTime) / 1000).toFixed(3));
            run();
            await new Promise((r) => exitCondition(r, curDuration));
            stop();
            const coverageNow = SnapCheck.snapAdapter.instrumenter.getCoverageRatio();
            coverage = Math.max(coverage, coverageNow);
            console.log('completed');
            // await sendTestResult(coverage);
            await sendTrace(coverage, inputIndex);
        }

    }

};

snapFrame.onload = function () {
    SnapCheck.snapAdapter = new SnapAdapter(this.contentWindow);
};
$('#grade-all').on('click', traceAll);
