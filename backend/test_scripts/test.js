// Do not reuse used triggers.
// Get fresh copies with getTriggerByName or newTrigger
const __testNames = [
    "paddleMoveUp",
    "paddleMoveUpBoundary",
    "paddleMoveDown",
    "paddleMoveDownBoundary",
    "ballNotMoveBeforeSpace",
    "spaceBallMove",
    "ballTouchingPaddleBounce",
    "ballTouchingPaddleScore",
    "ballTouchingEdgeBounce",
    "ballTouchingRightEdgeScore",
    "ballTouchingRightEdgeReset"
];
const __Triggers =
[
    {
        name: 'testMoveUp',
        precondition: (t) => {
            return t.isKeyDown('up arrow') && t.getSpriteByName('Right Paddle').posY < 145
        },
        callback: function (t, oldState) {
            const paddleY = t.getSpriteByName('Right Paddle').posY;
            if (paddleY > oldState.paddleY)
            {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Paddle moves up');
                t.reportCase('paddleMoveUp', true);
                //t.reportCase(this.name, true);
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log(oldState.paddleY);
                console.log(paddleY);
                console.log('Not moving up!');
                t.reportCase('paddleMoveUp', false);
            }
        },
        stateSaver: (t) => {
            return {
            paddleY: t.getSpriteByName('Right Paddle', false).posY,
            time: Date.now()
        }},
        delay: 5,
        once: false,
        addOnStart: true
    },
    {
        name: 'testUpMiddle',
        precondition: (t) => {
            return t.isKeyDown('up arrow') && t.getSpriteByName('Right Paddle').posY >= 145
            &&  t.getSpriteByName('Right Paddle').posY < 180
        },
        callback: function (t, oldState) {
            const paddleY = t.getSpriteByName('Right Paddle').posY;
            if (paddleY > oldState.paddleY)
            {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Paddle moves up');
                t.reportCase('paddleMoveUp', true);
                //t.reportCase(this.name, true);
            } else if (paddleY === oldState.paddleY) {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log(oldState.paddleY);
                console.log(paddleY);
                console.log('At boundary');
                t.reportCase('paddleMoveUpBoundary', true);
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Not moving up!');
                t.reportCase('paddleMoveUp', false);
            }
        },
        stateSaver: (t) => {
            return {
            paddleY: t.getSpriteByName('Right Paddle', false).posY,
            time: Date.now()
        }},
        delay: 5,
        once: false,
        addOnStart: true
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
                t.reportCase('paddleMoveUpBoundary', false);
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log(oldState.paddleY);
                console.log(paddleY);
                console.log('At boundary');
                t.reportCase('paddleMoveUpBoundary', true);
            }
        },
        stateSaver: (t) => {
            return {
                paddleY: t.getSpriteByName('Right Paddle', false).posY,
                time: Date.now()
            }},
        delay: 5,
        once: false,
        addOnStart: true
    },
    {
        name: 'testMoveDown',
        precondition: (t) =>
            t.isKeyDown('down arrow') && t.getSpriteByName('Right Paddle').posY > -145,
        callback: function (t, oldState) {
            const paddleY = t.getSpriteByName('Right Paddle').posY;
            if (paddleY < oldState.paddleY)
            {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Paddle moves down');
                t.reportCase('paddleMoveDown', true);
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log(oldState.paddleY);
                console.log(paddleY);
                console.log('Not moving down!');
                t.reportCase('paddleMoveDown', false);
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
        addOnStart: true
    },
    {
        name: 'testDownMiddle',
        precondition: (t) => {
            return t.isKeyDown('down arrow') && t.getSpriteByName('Right Paddle').posY <= -145
            &&  t.getSpriteByName('Right Paddle').posY > -180
        },
        callback: function (t, oldState) {
            const paddleY = t.getSpriteByName('Right Paddle').posY;
            if (paddleY < oldState.paddleY)
            {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Paddle moves down');
                t.reportCase('paddleMoveDown', true);
                //t.reportCase(this.name, true);
            } else if (paddleY === oldState.paddleY) {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log(oldState.paddleY);
                console.log(paddleY);
                console.log('At boundary');
                t.reportCase('paddleMoveDownBoundary', true);
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Not moving down!');
                t.reportCase('paddleMoveDown', false);
            }
        },
        stateSaver: (t) => {
            return {
            paddleY: t.getSpriteByName('Right Paddle', false).posY,
            time: Date.now()
        }},
        delay: 5,
        once: false,
        addOnStart: true
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
                t.reportCase('paddleMoveDownBoundary', false);
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log(oldState.paddleY);
                console.log(paddleY);
                console.log('At boundary');
                t.reportCase('paddleMoveDownBoundary', true);
            }
        },
        stateSaver: (t) => {
            console.log(`record:${t.getSpriteByName('Right Paddle', true).posY}`);
            return {
            paddleY:  t.getSpriteByName('Right Paddle', false).posY,
            time: Date.now()
        }},
        delay: 5,
        once: false,
        addOnStart: true
    },
    {
        name: 'testBallNotMoveBeforeSpace',
        precondition: (t) => true,
        callback: function (t, oldState) {
            const ballX = t.getSpriteByName('Ball').posX;
            const ballY = t.getSpriteByName('Ball').posY;            
            if (ballX === oldState.ballX && ballY === oldState.ballY)
            {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Ball does not moves before space');
                t.reportCase('ballNotMoveBeforeSpace', true)
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Ball moves before space!');
                t.reportCase('ballNotMoveBeforeSpace', false)
            }
        },
        stateSaver: (t) => ({
            ballX: t.getSpriteByName('Ball').posX,
            ballY: t.getSpriteByName('Ball').posY
        }),
        delay: 5,
        once: false,
        addOnStart: true
    },
    {
        name: 'testSpaceBallMove',
        precondition: (t) => {
            return t.isKeyDown('space');
        },
        callback: function (t, oldState) {
            const ballX = t.getSpriteByName('Ball').posX;
            const ballY = t.getSpriteByName('Ball').posY;
            if (ballX != oldState.ballX || ballY != oldState.ballY)
            {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Ball moves');
                t.reportCase('spaceBallMove', true);
                //t.reportCase(this.name, true);
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Ball does not move!');
                t.reportCase('spaceBallMove', false);
            }
            t.removeTriggerByName('testSpaceBallMove');
        },
        stateSaver: (t) => ({
            ballX: t.getSpriteByName('Ball').posX,
            ballY: t.getSpriteByName('Ball').posY
        }),
        delay: 5,
        once: false,
        addOnStart: true
    },
    /*
    {
        name: 'ballTouchingPaddleBounce',
        precondition: (t) => t.spriteIsTouching('Right Paddle', 'Ball'),
        callback: (t, oldState) => {
            const ballDir = t.getSpriteByName('Ball').dir;
            const ballX = t.getSpriteByName('Ball').posX;
            //const ballY = t.getSpriteByName('Ball').posY;
            //const tanA = Math.tan(oldState.ballDir / 180 * Math.PI);
            //const tanB = Math.tan(ballDir / 180 * Math.PI);
            //const x = (tanA * oldState.ballX - tanB * ballX  + ballY - oldState.ballY)/(tanA - tanB);
            const paddleX = t.getSpriteByName('Right Paddle').posX;
            console.log(`side:${(ballX - paddleX) * (oldState.ballX - paddleX) > 0}`);
            if (ballDir !== oldState.ballDir && 
               (ballX - paddleX) * (oldState.ballX - paddleX) > 0
               //x < 190
            ) {
                console.log('====');
                //console.log(ballX);
                //console.log(paddleX);
                //console.log(x);
                console.log(t.snapAdapter.stepper.stepCount);
                console.log('------');
                console.log(ballDir);
                //console.log(oldState.time);
                //console.log(Date.now());
                console.log('Ball turns on touching paddle');
                t.reportCase('ballTouchingPaddleBounce', true);
            } else {
                console.log('====')
                console.log(t.snapAdapter.stepper.stepCount);
                console.log('------');
                //console.log(oldState.time);
                //console.log(Date.now());
                console.log(ballDir);
                console.log(oldState.ballDir);
                console.log('Ball does not turn on touching paddle!');
                t.reportCase('ballTouchingPaddleBounce', false);
            }
        },
        stateSaver: (t) => {
            console.log(`dir:${t.getSpriteByName('Ball', false).dir}`);
            console.log(t.snapAdapter.stepper.stepCount);
            return {
                ballDir: t.getSpriteByName('Ball', false).dir, 
                ballX: t.getSpriteByName('Ball', false).posX,
                ballY: t.getSpriteByName('Ball', false).posY,
                time: Date.now()}
        },
        delay: 0,
        once: false,
        debounce: true,
        addOnStart: false
    }, */
    {
        name: 'ballTouchingPaddleBounce',
        precondition: (t) => t.spriteIsTouching('Right Paddle', 'Ball'),
        callback: (t, oldState) => {
            const dirB = t.getSpriteByName('Ball').dir;
            const xB = t.getSpriteByName('Ball').posX;
            const yB = t.getSpriteByName('Ball').posY;
            const dirA = oldState.ballDir;
            const xA = oldState.ballX;
            const yA = oldState.ballY;
            console.log("dirA: ", dirA, 'dirB: ', dirB);

            //const ballY = t.getSpriteByName('Ball').posY;
            const kA = 1/(Math.tan(dirA / 180 * Math.PI));
            const kB = 1/(Math.tan(dirB / 180 * Math.PI));

            const x = (yB - yA - xB*kB + xA*kA )/(kA - kB);
            console.log(`A line:  y = ${kA} (x - ${xA}) + ${yA}`);
            console.log(`B line:  y = ${kB} (x - ${xB}) + ${yB}`);

            console.log('x: ', x);

            const paddleX = t.getSpriteByName('Right Paddle').posX;
            console.log('paddleX: ', paddleX);
            if (dirB !== dirA) {
                if (dirB + dirA === 360 && x > 229 && x < 235){
                console.log('Ball does not turn on touching paddle, it turned on right edge');
                t.reportCase('ballTouchingPaddleBounce', false);}
                else {
                    console.log('Ball turn on touching paddle');
                    t.reportCase('ballTouchingPaddleBounce', true);
                }
            } else {
                console.log('Ball does not turn on touching paddle!');
                t.reportCase('ballTouchingPaddleBounce', false);
            }
        },
        stateSaver: (t) =>
        ({ballDir: t.getSpriteByName('Ball', false).dir,
          ballX: t.getSpriteByName('Ball', false).posX,
          ballY: t.getSpriteByName('Ball', false).posY,
          time: Date.now()}),
        delay: 10,
        once: false,
        addOnStart: true
    },  
    {
        name: 'ballTouchingPaddleScore',
        precondition: (t) => t.spriteIsTouching('Right Paddle', 'Ball'),
        callback: (t, oldState) => {
            const score = t.getFirstVariableValue();
            if (score && (score.value !== oldState.score.value)) {
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
        ({score: t.getFirstVariableValue(false), time: Date.now()}),
        delay: 10,
        once: false,
        addOnStart: true
    },
    
    {
        name: 'ballTouchingEdgeBounce',
        precondition: (t) => {
            // console.log(t.getSpriteByName('Ball').edgesTouched);
            return t.spriteIsOnEdge('Ball', ['left', 'top', 'bottom'])},
        callback: (t, oldState) => {
            const ballDir = t.getSpriteByName('Ball').dir
            console.log('||')
            console.log(t.snapAdapter.stepper.stepCount);
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
            console.log("!@");
            console.log(t.snapAdapter.stepper.stepCount);
            console.log(t.getSpriteByName('Ball', false).dir);
            return {ballDir: t.getSpriteByName('Ball', false).dir, time: Date.now()}
        },
        delay: 0,
        once: false,
        debounce: true,
        addOnStart: true
    },
    // ball touching edge tests
    {
        name: 'ballTouchingRightEdgeScore',
        precondition: (t) => t.spriteIsOnEdge('Ball', ['right']) &&
            t.getFirstVariableValue() && t.getFirstVariableValue().value != 0,
        callback: (t, oldState) => {
            const score = t.getFirstVariableValue();
            if (score && (score.value == 0)) {
                console.log('------');
                console.log(Date.now());
                console.log('Score reset on touching right edge');
                t.reportCase('ballTouchingRightEdgeScore', true);
            } else {
                console.log('------');
                console.log(Date.now());
                console.log(score);
                console.log('Score does not reset on touching right edge!');
                t.reportCase('ballTouchingRightEdgeScore', false);
            }
        },
        stateSaver: (t) => {
            //console.log(t.snapAdapter.stepper.stepCount);
            return null;},
        delay: 10,
        once: false,
        debounce: true,
        addOnStart: true
    },
    {
        name: 'ballTouchingRightEdgeReset',
        precondition: (t) => t.spriteIsOnEdge('Ball', ['right']),
        callback: (t, oldState) => {
            const ballX = t.getSpriteByName('Ball').posX;
            const ballY = t.getSpriteByName('Ball').posY;
            if (ballX < 10 && ballX > -10 && ballY < 10 && ballY > -10) {
                console.log('------');
                console.log(Date.now());
                console.log('Ball reset on touching right edge');
                t.reportCase('ballTouchingRightEdgeReset', true);
            } else {
                console.log('------');
                console.log(Date.now());
                console.log('Ball does not reset on touching right edge!');
                t.reportCase('ballTouchingRightEdgeReset', false);
            }
            //t.addTriggerByName('testBallNotMoveBeforeSpace');
            t.addTriggerByName('waitToPressSpace');
        },
        stateSaver: (t) => null,
        delay: 0,
        once: false,
        debounce: true,
        addOnStart: true
    },
    // controls
    {
        name: 'waitToPressSpace',
        precondition: (t) => true,
        callback: (t, oldState) => {
            t.removeTriggerByName('testBallNotMoveBeforeSpace');
            t.addTriggerByName('pressSpaceKey');
        },
        stateSaver: (t) => null,
        delay: 50,
        once: true,
        addOnStart: true
    },
    {
        name: 'pressSpaceKey',
        precondition: (t) => true,
        callback: (t, oldState) => {
            t.inputKey('space', 2);
            // t.addTrigger(t.getTriggerByName('followBall'));
            // t.addTrigger(t.getTriggerByName('randomUpDownKey'));
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
            const paddleY = t.getSpriteByName('Right Paddle').posY;
            if (paddleY < oldState.ballY - 5) {
                t.inputKey('up arrow', 2);
            } else if (paddleY > oldState.ballY + 5) {
                t.inputKey('down arrow', 2);
            }
        },
        stateSaver: (t) => {
            return {
                ballY: t.getSpriteByName('Ball').posY,
                time: Date.now()
            }
        },
        delay: 5,
        once: false,
        addOnStart: false
    },
    {
        name: 'ballTouchPaddleStopFollow',
        precondition: (t) => t.spriteIsTouching('Right Paddle', 'Ball'),
        callback: (t, oldState) => {
            t.removeTriggerByName('followBall');
            t.addTriggerByName('evadeBall');
        },
        stateSaver: (t) => null,
        delay: 0,
        once: false,
        addOnStart: false,
        debounce: true
    },
    {
        name: 'ballTouchRightEdgeStartFollow',
        precondition: (t) => t.spriteIsOnEdge('Ball', ['right']),
        callback: (t, oldState) => {
            t.removeTriggerByName('evadeBall');
            t.addTriggerByName('followBall');
        },
        stateSaver: (t) => null,
        delay: 25,
        once: false,
        addOnStart: false,
        debounce: true
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
        addOnStart: false
    },
    {
        name: 'evadeBall',
        precondition: (t) => true,
        callback: (t, oldState) => {
            const paddleY = t.getSpriteByName('Right Paddle').posY;
            if (paddleY < 170) {
                t.inputKey('up arrow', 2);
            }
        },
        stateSaver: (t) => ({
            ballY: t.getSpriteByName('Ball').posY,
            time: Date.now()
        }),
        delay: 5,
        once: false,
        addOnStart: false
    },
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
