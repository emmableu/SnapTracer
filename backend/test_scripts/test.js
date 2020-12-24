// Do not reuse used triggers. 
// Get fresh copies with getTriggerByName or newTrigger
const _testTriggers = 
[
    {
        name: 'testMoveUp',
        precondition: (t) => t.isKeyDown('up arrow'),
        callback: (t, oldState) => {
            const paddleY = t.getSpriteByName('paddle').posY;
            if (paddleY > oldState.paddleY)
            {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Paddle moves up');
                t.reportCase('testMoveUp', true);
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
        stateSaver: (t) => ({
            paddleY: t.getSpriteByName('paddle').posY,
            time: Date.now() 
        }),
        delay: 5,
        once: false
    },
    {
        name: 'testMoveDown',
        precondition: (t) => t.isKeyDown('down arrow'),
        callback: (t, oldState) => {
            const paddleY = t.getSpriteByName('paddle').sprite.yPosition();
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
            console.log(`record:${t.getSpriteByName('paddle').sprite.yPosition()}`);
            return {
            paddleY: t.getSpriteByName('paddle').sprite.yPosition(),
            time: Date.now() 
        }},
        delay: 5,
        once: false
    }    
];
_testTriggers