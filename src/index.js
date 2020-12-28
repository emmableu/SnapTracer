const {$} = require('./web-libs');
const _ = require('lodash');
// const Sprites = require('./sprites');
const SnapAdapter = require('./snap-adapter');
const TestController = require('./test-controller');

window.$ = $;

const Grab = window.Grab = {};

const snapFrame = document.getElementsByTagName('iframe')[0];

const serverUrl = 'http://localhost:3000';

const loadProjectList = async function () {
    const projectList = await Promise.resolve($.get(`${serverUrl}/project_list`));
    return projectList;
};

const loadTriggers = async function () {
    const tests = await Promise.resolve($.get({
        url: `${serverUrl}/test_script/`,
        dataType: 'text'
    }));
    // eslint-disable-next-line no-eval
    Grab.testController.triggers = eval(tests);
    Grab.testNames = Grab.testController.triggers
        .filter(tr => tr.reportInStatistics).map(tr => tr.name);

    Grab.testController.triggers.filter(tr => tr.addOnStart).forEach(
        tr => Grab.snapAdapter.stepper.addTrigger(Grab.testController.bindTrigger(tr))
    );
    //console.log(Grab.snapAdapter.stepper.triggers);
};

const loadProject = async function (projectName = 'pong_dupcb.xml') {

    Grab.currentProjectName = projectName;
    //snapFrame.contentWindow.focus();

    Grab.testController = new TestController(Grab.snapAdapter);

    const project = await Promise.resolve($.get({
        url: `${serverUrl}/project_file/${Grab.currentProjectName}`,
        dataType: 'text'
    }));
    
    Grab.snapAdapter.loadProject(project);

    console.log(Grab.snapAdapter.stage);
    
    await loadTriggers();

};

const run = function () {
    Grab.snapAdapter.stepper.run();
};

const sendTestResult = async function () {
    const stat = {};
    for (const test of Grab.testNames) {
        stat[test] = {success: 0, fail: 0};
    }
    for (const item of Grab.testController.statistics) {
        console.log(item.name);
        stat[item.name][item.status ? 'success' : 'fail']++;
    }
    console.log(stat);
    await $.post(`${serverUrl}/save_test_result/`, {
        projectName: Grab.currentProjectName,
        stat: stat
    });
};

const sendTrace = async function () {
    const i = 0;
    await $.post(`${serverUrl}/save_trace/${i}`, {
        projectName: Grab.currentProjectName,
        coverage: 0,
        trace: JSON.stringify(Grab.snapAdapter.trace)
    });
};

const stop = function () {
    Grab.snapAdapter.stepper.stop();
};


const gradeAll = async function () {
    Grab.projectList = await loadProjectList();
    for (let i = 0; i < Grab.projectList.length; i++) {
        const currentProjectName = Grab.projectList[i];
        Grab.snapAdapter.reset();
        await loadProject(currentProjectName);
        console.log(currentProjectName);
        run();
        await new Promise(r => setTimeout(r, 10000));
        stop();
        await sendTestResult();
        await sendTrace();
    }

};

snapFrame.onload = function () {
    Grab.snapAdapter = new SnapAdapter(this.contentWindow);

};
$('#grade-all').on('click', gradeAll);
$('#load').on('click', () => loadProject());
$('#run').on('click', run);
$('#stop').on('click', stop);
