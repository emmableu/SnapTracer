// Do not reuse used triggers.
// Get fresh copies with getTriggerByName or newTrigger
const _testTriggers =
[
    {
        name: 'testMoveUp',
        precondition: (t) => {
            return t.isKeyDown('up arrow') && t.getSpriteByName('Right Paddle').posY < 180
        },
        callback: function (t, oldState) {
            const paddleY = t.getSpriteByName('Right Paddle').posY;
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
            paddleY: t.getSpriteByName('Right Paddle', false).posY,
            time: Date.now()
        }},
        delay: 5,
        once: false,
        addOnStart: true,
        reportInStatistics: true
    },
    {
        name: 'testMoveUpBoundary',
        precondition: (t) => {
            return t.isKeyDown('up arrow') && t.getSpriteByName('Right Paddle').posY >= 180
        },
        callback: function (t, oldState) {
            const paddleY = t.getSpriteByName('Right Paddle').posY;
            if (paddleY > oldState.paddleY)
            {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Still moves up!');
                t.reportCase('testMoveUpBoundary', false);
                //t.reportCase(this.name, true);
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log(oldState.paddleY);
                console.log(paddleY);
                console.log('At boundary');
                t.reportCase('testMoveUpBoundary', true);
            }
        },
        stateSaver: (t) => {
            return {
            paddleY: t.getSpriteByName('Right Paddle', true).posY,
            time: Date.now()
        }},
        delay: 1,
        once: false,
        addOnStart: true,
        reportInStatistics: true
    },
    {
        name: 'testMoveDown',
        precondition: (t) => 
            t.isKeyDown('down arrow') && t.getSpriteByName('Right Paddle').posY > -180,
        callback: function (t, oldState) {
            const paddleY = t.getSpriteByName('Right Paddle').posY;
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
            console.log(`record:${t.getSpriteByName('Right Paddle', false).posY}`);
            return {
            paddleY:  t.getSpriteByName('Right Paddle', false).posY,
            time: Date.now()
        }},
        delay: 5,
        once: false,
        addOnStart: true,
        reportInStatistics: true
    },
    {
        name: 'testMoveDownBoundary',
        precondition: (t) => 
            t.isKeyDown('down arrow') && t.getSpriteByName('Right Paddle').posY <= -180,
        callback: function (t, oldState) {
            const paddleY = t.getSpriteByName('Right Paddle').posY;
            if (paddleY < oldState.paddleY)
            {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Still moves down!');
                t.reportCase('testMoveDownBoundary', false);
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log(oldState.paddleY);
                console.log(paddleY);
                console.log('At boundary');
                t.reportCase('testMoveDownBoundary', true);
            }
        },
        stateSaver: (t) => {
            console.log(`record:${t.getSpriteByName('Right Paddle', true).posY}`);
            return {
            paddleY:  t.getSpriteByName('Right Paddle', true).posY,
            time: Date.now()
        }},
        delay: 1,
        once: false,
        addOnStart: true,
        reportInStatistics: true
    },
    {
        name: 'ballTouchingPaddleBounce',
        precondition: (t) => t.spriteIsTouching('Right Paddle', 'Ball'),
        callback: (t, oldState) => {
            const ballDir = t.getSpriteByName('Ball').dir
            if (ballDir !== oldState.ballDir) {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Ball turns on touching paddle');
                t.reportCase('ballTouchingPaddleBounce', true);
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log(ballDir);
                console.log(oldState.ballDir);
                console.log('Ball does not turn on touching paddle!');
                t.reportCase('ballTouchingPaddleBounce', false);
            }            
        },
        stateSaver: (t) => 
        ({ballDir: t.getSpriteByName('Ball', false).dir, time: Date.now()}),
        delay: 1,
        once: false,
        addOnStart: true,
        reportInStatistics: true
    },
    {
        name: 'ballTouchingPaddleScore',
        precondition: (t) => t.spriteIsTouching('Right Paddle', 'Ball'),
        callback: (t, oldState) => {
            const score = t.getFirstVariableValue()
            if (score !== oldState.score) {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Score changes on touching paddle');
                t.reportCase('ballTouchingPaddleScore', true);
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log(score);
                console.log(oldState.score);
                console.log('Score does not change on touching paddle!');
                t.reportCase('ballTouchingPaddleScore', false);
            }            
        },
        stateSaver: (t) => 
        ({score: t.getFirstVariableValue(), time: Date.now()}),
        delay: 1,
        once: false,
        addOnStart: false,
        reportInStatistics: true
    },
    {
        name: 'ballTouchingEdgeBounce',
        precondition: (t) => {
            // console.log(t.getSpriteByName('Ball').edgesTouched);
            return t.spriteIsOnEdge('Ball', ['left'])},
        callback: (t, oldState) => {
            const ballDir = t.getSpriteByName('Ball').dir
            if (ballDir !== oldState.ballDir) {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Ball turns on touching edge');
                t.reportCase('ballTouchingEdgeBounce', true);
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log(ballDir);
                console.log(oldState.ballDir);
                console.log('Ball does not turn on touching edge!');
                t.reportCase('ballTouchingEdgeBounce', false);
            }            
        },
        stateSaver: (t) =>  {
            return {ballDir: t.getSpriteByName('Ball').dir, time: Date.now()}
        },
        delay: 3,
        once: false,
        addOnStart: true,
        reportInStatistics: true
    },
    {
        name: 'ballTouchingRightEdgeScore',
        precondition: (t) => t.spriteIsOnEdge('Ball', ['right']),
        callback: (t, oldState) => {
            const score = t.getFirstVariableValue();
            if (oldState.value != 0) {
                if (score.value == 0) {
                    console.log('------');
                  console.log(Date.now());
                  console.log('Score reset on touching right edge');
                  t.reportCase('ballTouchingPaddleScore', true);
                } else {
                   console.log('------');
                   console.log(Date.now());
                   console.log(score);
                   console.log('Score does not reset on touching right edge!');
                  t.reportCase('ballTouchingPaddleScore', false);
                }   
            }        
        },
        stateSaver: (t) => t.getFirstVariableValue(),
        delay: 2,
        once: false,
        addOnStart: false,
        reportInStatistics: true
    },
    {
        name: 'pressSpaceKey',
        precondition: (t) => true,
        callback: (t, oldState) => {
            t.inputKey('space', 1);
            // t.addTrigger(t.getTriggerByName('followBall'));
            // t.addTrigger(t.getTriggerByName('randomUpDownKey'));
        },
        stateSaver: (t) => null,
        delay: 100,
        once: false,
        addOnStart: true,
        reportInStatistics: false
    },
    {
        name: 'followBall',
        precondition: (t) => true,
        callback: (t, oldState) => {
            const paddleY = t.getSpriteByName('Right Paddle').posY;
            if (paddleY < oldState.ballY - 5) {
                t.inputKey('up arrow', 1);
            } else if (paddleY > oldState.ballY + 5) {
                t.inputKey('down arrow', 1);
            }
        },
        stateSaver: (t) => ({
            ballY: t.getSpriteByName('Ball').posY,
            time: Date.now()
        }),
        delay: 1,
        once: false,
        addOnStart: false,
        reportInStatistics: false
    },
    {
        name: 'randomUpDownKey',
        precondition: (t) => true,
        callback: (t, oldState) => {
            const toss = t.random(-1, 1);
            if (toss < 0) {
                t.inputKey('up arrow', 1);
            } else if (toss > 0) {
                t.inputKey('down arrow', 1);
            }
        },
        stateSaver: (t) => null,
        delay: 5,
        once: false,
        addOnStart: false,
        reportInStatistics: false
    },
    {
        name: 'randomDirection',
        precondition: (t) => true,
        callback: (t, oldState) => {
            const toss = t.random(0, 1);
            if (toss === 0) {
                t.removeTriggerByName('downKey')
                t.addTriggerByName('upKey');
            } else if (toss === 1) {
                t.removeTriggerByName('upKey')
                t.addTriggerByName('downKey');
            }
        },
        stateSaver: (t) => null,
        delay: 50,
        once: false,
        addOnStart: true,
        reportInStatistics: false
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
        addOnStart: false,
        reportInStatistics: false
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
        addOnStart: false,
        reportInStatistics: false       
    }
];
_testTriggers
