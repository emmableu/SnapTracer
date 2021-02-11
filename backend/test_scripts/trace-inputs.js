// Do not reuse used triggers.
// Get fresh copies with getTriggerByName or newTrigger
const __testNames = [
  'empty+space',
    'threeSecStateUnchanged',
    'followBall',
    'upKey',
    'downKey',
    'randomDirection'
];
const __Triggers =
    [
        {
            name: 'randomDirection',
            precondition: (t) => true,
            callback: (t, oldState) => {
                const toss = t.random(0, 1);
                if (t.getSpriteByName('Right Paddle').posY > 200) {
                    t.removeTriggerByName('upKey');
                    t.removeTriggerByName('downKey');
                    t.addTriggerByName('downKey');
                } else if (t.getSpriteByName('Right Paddle').posY < -200) {
                    t.removeTriggerByName('upKey');
                    t.removeTriggerByName('downKey');
                    t.addTriggerByName('upKey');
                } else {
                    if (toss === 0) {
                        t.removeTriggerByName('upKey');
                        t.removeTriggerByName('downKey');
                        t.addTriggerByName('upKey');
                    } else if (toss === 1) {
                        t.removeTriggerByName('upKey');
                        t.removeTriggerByName('downKey');
                        t.addTriggerByName('downKey');
                    }
                }
            },
            stateSaver: (t) => null,
            delay: 100,
            once: false,
            addOnStart: true
        },
        {
            name: 'empty+space',
            precondition: (t) => true,
            callback: (t, oldState) => {
                t.addTriggerByName('pressSpaceKey');
            },
            stateSaver: (t) => {
            },
            delay: 50,
            once: true,
            addOnStart: true
        },

        {
            name: 'threeSecStateUnchanged',
            precondition: (t) => true,
            callback: (t, oldState) => {
               const paddle = t.snapAdapter.state.getSpriteByName('Right Paddle'),
                    ball = t.snapAdapter.state.getSpriteByName('Ball');
                console.log('checking threeSecStateUnchanged');
               let unChanged = true;
               for (const attr of ['posX', 'posY']){
                   if (paddle[attr] !== oldState.paddle[attr] ||
                       ball[attr] !== oldState.ball[attr]){
                       unChanged = false;
                       break;
                   }
               }
               t.reportCase('threeSecStateUnchanged', unChanged);
            },
            stateSaver: (t) => {
                return {
                    paddle: t.snapAdapter.state.getSpriteByName('Right Paddle'),
                    ball: t.snapAdapter.state.getSpriteByName('Ball')
                }
            },
            delay: 100,
            once: false,
            addOnStart: true
        },

        {
            name: 'pressSpaceKey',
            precondition: (t) => true,
            callback: (t, oldState) => {
                t.inputKey('space', 2);
            },
            stateSaver: (t) => null,
            delay: 0,
            once: true,
            addOnStart: false
        },

        {
            name: 'followBall',
            precondition: (t) => true,
            callback: (t, oldState) => {
                const paddleY = t.snapAdapter.state.getSpriteByName('Right Paddle').posY;
                if (paddleY < oldState.ballY - 5) {
                    t.inputKey('up arrow', 2);
                } else if (paddleY > oldState.ballY + 5) {
                    t.inputKey('down arrow', 2);
                }
            },
            stateSaver: (t) => {
                return {
                    ballY: t.snapAdapter.state.getSpriteByName('Ball').posY,
                    time: Date.now()
                }
            },
            //delay defines how many steps to pass by until this event happens again.
            delay: 5,
            once: false,
            addOnStart: false
        },

        {
            name: 'upKey',
            precondition: (t) => true,
            callback: (t, oldState) => {
                t.inputKey('up arrow', 1);
            },
            stateSaver: (t) => null,
            delay: 5,
            once: false,
            addOnStart: false
        },
        {
            name: 'downKey',
            precondition: (t) => true,
            callback: (t, oldState) => {
                t.inputKey('down arrow', 1);
            },
            stateSaver: (t) => null,
            delay: 5,
            once: false,
            addOnStart: false
        }
    ];
const __TriggerExports = { testNames: __testNames, triggers: __Triggers };
__TriggerExports
