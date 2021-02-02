const {$} = require('./web-libs');
const _ = require('lodash');
const seedRandom = require('seedrandom');
const SnapAdapter = require('./snap-adapter');
const TestController = require('./test-controller');

window.$ = $;

const SnapCheck = window.SnapCheck = {};
SnapCheck.stat = {};

SnapCheck.lowConfidenceRetry = 1;
SnapCheck.testSet = [
    {
        duration: 10000,
        triggerSwitches: {
            randomDirection: false,
            upKey: true
        },
        stepRequirement: 100
    },
    {
        duration: 10000,
        triggerSwitches: {
            randomDirection: false,
            downKey: true
        },
        stepRequirement: 100
    },
    {
        duration: 25000,
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
        duration: 25000,
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
        duration: 25000,
        stepRequirement: 1000
    },
    {
        duration: 25000,
        stepRequirement: 1000
    }
];

//SnapCheck.coverageRequirement = 0.7;

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

    SnapCheck.testController = new TestController(SnapCheck.snapAdapter);
    // eslint-disable-next-line no-eval
    const testScript = eval(tests);
    SnapCheck.testController.triggers = testScript.triggers;
    SnapCheck.testNames = testScript.testNames;
    // SnapCheck.testController.triggers
    //     .filter(tr => tr.reportInStatistics).map(tr => tr.name);

    if (addOnStart !== null) {
        SnapCheck.testController.triggers.forEach(tr => {
            if (tr.name in addOnStart) {
                tr.addOnStart = addOnStart[tr.name];
                console.log(tr.name);
                console.log(addOnStart[tr.name]);
            }
        });
    }
    SnapCheck.testController.triggers.filter(tr => tr.addOnStart).forEach(
        tr => SnapCheck.snapAdapter.stepper.addTrigger(SnapCheck.testController.bindTrigger(tr))
    );
};

const getProject = async function () {

    const projectName = SnapCheck.currentProjectName;
    const projectXML = await Promise.resolve($.get({
        url: `${serverUrl}/project_file/${projectName}`,
        dataType: 'text'
    }));

    return projectXML;
};


const loadProject = function (projectString) {

    SnapCheck.snapAdapter.loadProject(projectString);

    console.log(SnapCheck.snapAdapter.stage);
};
const loadOnce = async function (projectName = '20_3.xml') {

    SnapCheck.currentProjectName = projectName;
    const projectXML = await getProject();
    const tests = await getTests();
    SnapCheck.snapAdapter.reset();
    loadProject(projectXML);
    loadTriggers(tests);

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
        // console.log(item.name);
            stat[item.name][item.status ? 'success' : 'fail']++;
        }
        SnapCheck.stat = stat;
    }


    console.log(SnapCheck.stat);
    await $.post(`${serverUrl}/save_test_result/`, {
        projectName: SnapCheck.currentProjectName,
        stat: SnapCheck.stat,
        validBlocks: SnapCheck.snapAdapter.instrumenter.getValidBlockNumber(),
        deadBlocks: SnapCheck.snapAdapter.instrumenter.getDeadBlockNumber(),
        coverage: coverage
    }).promise();
};

const sendTrace = async function (coverage) {
    const i = 0;
    await $.post(`${serverUrl}/save_trace/${i}`, {
        projectName: SnapCheck.currentProjectName,
        coverage: coverage,
        trace: JSON.stringify(SnapCheck.snapAdapter.trace)
    }).promise();
};

const stop = function () {
    SnapCheck.snapAdapter.stepper.stop();
};


const gradeAll = async function () {
    SnapCheck.projectList = await getProjectList();
    for (let i = 0; i < SnapCheck.projectList.length; i++) {
        const currentProjectName = SnapCheck.projectList[i];
        SnapCheck.currentProjectName = currentProjectName;
        console.log(currentProjectName);
        const projectXML = await getProject();
        const tests = await getTests();
        let coverage = 0;

        loadTriggers(tests);
        for (const test of SnapCheck.testNames) {
            SnapCheck.stat[test] = {success: 0, fail: 0};
        }

        let round = 0;
        let isLowConfidence = false;
        do {
            for (let j = 0; j < SnapCheck.testSet.length;) {
                SnapCheck.snapAdapter.reset();
                loadProject(projectXML);
                loadTriggers(tests, SnapCheck.testSet[j].triggerSwitches);
                const durationNow = SnapCheck.testSet[j].duration;
                // seedRandom(currentProjectName + j.toString(), {global: true});
                run();
                await new Promise(r => setTimeout(r, durationNow));
                stop();
                const coverageNow = SnapCheck.snapAdapter.instrumenter.getCoverageRatio();
                console.log(coverage);
                coverage = Math.max(coverage, coverageNow);

                for (const item of SnapCheck.testController.statistics) {
                // console.log(item.name);
                    SnapCheck.stat[item.name][item.status ? 'success' : 'fail']++;
                }
                if (SnapCheck.snapAdapter.stepper.stepCount > SnapCheck.testSet[j].stepRequirement) {
                    j++;
                }
            // console.log(SnapCheck.snapAdapter.stepper.stepCount);
            // console.log(`timeoutN:${timeoutN}`);
            }
            isLowConfidence = SnapCheck.testNames.some(test => {
                const nSucc = SnapCheck.stat[test].success;
                const nFail = SnapCheck.stat[test].fail;
                const nTot = nSucc + nFail;
                const rSucc = nSucc / nTot;
                return (rSucc >= 0.25 && rSucc <= 0.75) || nTot < 4;
            });
            round++;
        } while (round <= SnapCheck.lowConfidenceRetry && isLowConfidence);
        await sendTestResult(coverage);
        // await sendTrace(coverage);
    }

};

snapFrame.onload = function () {
    SnapCheck.snapAdapter = new SnapAdapter(this.contentWindow);

};
$('#grade-all').on('click', gradeAll);
$('#load').on('click', () => loadOnce());
$('#run').on('click', run);
$('#stop').on('click', () => {
    stop();
    sendTestResult(0, true);
    // sendTrace(0);
});
