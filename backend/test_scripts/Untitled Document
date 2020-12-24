// Do not reuse used triggers. 
// Get fresh copies with getTriggerByName or newTrigger
[
    {
        name: 'testMoveUp',
        precondition: (t) => t.isKeyDown('move up'),
        callback: (t, oldState) => {
            const paddleY = t.getSpriteByName('paddle').posY;
            if (paddleY < oldState.paddleY)
            {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log('Paddle moves up');
            } else {
                console.log('------');
                console.log(oldState.time);
                console.log(Date.now());
                console.log(oldState.paddleY);
                console.log(paddleY);
                console.log('Not moving up!');
            }
        },
        dataSaver: (t) => ({
            paddleY: t.getSpriteByName('paddle').posY,
            time: Date.now() 
        }),
        delay: 5,
        once: false
    }
]