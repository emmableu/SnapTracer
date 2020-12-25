// Do not reuse used triggers.
// Get fresh copies with getTriggerByName or newTrigger
const _testTriggers =
[
    {
        name: 'testMoveUp',
        precondition: (t) => {
            return t.isKeyDown('up arrow')
        },
        callback: function (t, oldState) {
            const paddleY = t.getSpriteByName('paddle').posY;
            if (paddleY > oldState.paddleY)
            {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Paddle moves up');
                t.reportCase('testMoveUp', true);
                //t.reportCase(this.name, true);
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log(oldState.paddleY);
                console.log(paddleY);
                console.log('Not moving up!');
                t.reportCase('testMoveUp', false);
            }
        },
        stateSaver: (t) => {
            return {
            paddleY: t.getSpriteByName('paddle', false).posY,
            time: Date.now()
        }},
        delay: 1,
        once: false,
        addOnStart: true,
        reportInStatistics: true
    },
    {
        name: 'testMoveDown',
        precondition: (t) => t.isKeyDown('down arrow'),
        callback: function (t, oldState) {
            const paddleY = t.getSpriteByName('paddle').posY;
            if (paddleY < oldState.paddleY)
            {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Paddle moves down');
                t.reportCase('testMoveDown', true);
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log(oldState.paddleY);
                console.log(paddleY);
                console.log('Not moving down!');
                t.reportCase('testMoveDown', false);
            }
        },
        stateSaver: (t) => {
            console.log(`record:${t.getSpriteByName('paddle', false).posY}`);
            return {
            paddleY:  t.getSpriteByName('paddle', false).posY,
            time: Date.now()
        }},
        delay: 1,
        once: false,
        addOnStart: true,
        reportInStatistics: true
    },
    {
        name: 'pressSpaceKey',
        precondition: (t) => true,
        callback: (t, oldState) => {
            t.inputKey('space', 20);
            // t.addTrigger(t.getTriggerByName('randomUpDownKey'));
        },
        stateSaver: (t) => null,
        delay: 2,
        once: true,
        addOnStart: true,
        reportInStatistics: false
    },
    {
        name: 'randomUpDownKey',
        precondition: (t) => true,
        callback: (t, oldState) => {
            const toss = t.random(-1, 1, true);
            //if (toss < 0) {
                t.inputKey('down arrow', 500);
            //} else if (toss > 0) {
            //    t.inputKey('down arrow', 500);
            //}
        },
        stateSaver: (t) => null,
        delay: 1,
        once: false,
        addOnStart: true,
        reportInStatistics: false
    }
];
_testTriggers
