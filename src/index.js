const {$} = require('./web-libs');
const _ = require('lodash');
// const Sprites = require('./sprites');
const SnapAdapter = require('./snap-adapter');
const TestController = require('./test-controller');

window.$ = $;

const Grab = window.Grab = {};

Grab.timePerTest = 10000;
Grab.coverageRequirement = 0.7;

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

const loadTriggers = function (tests) {

    Grab.testController = new TestController(Grab.snapAdapter);
    // eslint-disable-next-line no-eval
    Grab.testController.triggers = eval(tests);
    Grab.testNames = Grab.testController.triggers
        .filter(tr => tr.reportInStatistics).map(tr => tr.name);

    Grab.testController.triggers.filter(tr => tr.addOnStart).forEach(
        tr => Grab.snapAdapter.stepper.addTrigger(Grab.testController.bindTrigger(tr))
    );
    //console.log(Grab.snapAdapter.stepper.triggers);
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
const loadOnce = async function (projectName = 'pong_bad3.xml') {

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

const sendTestResult = async function () {
    const stat = {};
    for (const test of Grab.testNames) {
        stat[test] = {success: 0, fail: 0};
    }
    for (const item of Grab.testController.statistics) {
        // console.log(item.name);
        stat[item.name][item.status ? 'success' : 'fail']++;
    }
    console.log(stat);
    await $.post(`${serverUrl}/save_test_result/`, {
        projectName: Grab.currentProjectName,
        stat: stat
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
        do {
            Grab.snapAdapter.reset();
            loadProject(projectXML);
            loadTriggers(tests);
            run();
            await new Promise(r => setTimeout(r, Grab.timePerTest));
            stop();
            coverage = Grab.snapAdapter.instrumenter.getCoverageRatio();
            console.log(coverage);
        } while (coverage < Grab.coverageRequirement);
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
$('#stop').on('click', stop);
