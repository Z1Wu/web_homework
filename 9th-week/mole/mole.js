(function addBoxes() {
    let main_area = document.getElementsByClassName('main-area')[0];
    for(let i = 0; i < 60; i++) {
        let newNode = document.createElement('div');
        newNode.classList.add('box');
        main_area.append(newNode);
    }
})();

window.onload = gameloop;

function gameloop() {
    let startBtn = document.getElementsByTagName('button')[0];
    let boxes = document.getElementsByClassName('box');
    let game_area = document.getElementsByClassName('main-area')[0];
    let clock = document.getElementsByClassName('time-input')[0];
    let score = document.getElementsByClassName('score-input')[0];
    let message = document.getElementsByClassName('state')[0];
    let running = false;
    let intervalID  = 0;

    game_area.addEventListener('click', gameClickHandler);
    startBtn.addEventListener('click', gameStateController);

    function gameStateController() {
        if(running) {
            clearInterval(intervalID);
            showRes();
            init();
            return;
        }
        init();
        chooseNextBox();
        message.innerText = 'RUNNING!';
        intervalID = setInterval(function() {
            let timeVal = parseInt(clock.value);
            if(timeVal === 0) {
                clearInterval(intervalID);
                showRes();
                init();
            }
            else {
                clock.value= timeVal - 1;
            }
        }, 1000);
    }

    function gameClickHandler() {
        let item = event.target;
        if(item.classList.contains('tar-box')) {
            score.value = parseInt(score.value) + 1;
            item.classList.remove('tar-box');
            chooseNextBox();
        } else {
            score.value = parseInt(score.value) - 1;
        }
    }

    function showRes() {
        let consumeTime = 30 - parseInt(clock.value);
        running = false;
        message.innerText = 'GAME OVER!';
        alert('GameOver! Your score is ' + score.value + ' use ' + consumeTime + ' s!');
    }

    function init() {
        for(let item of boxes) {
            item.classList.remove('tar-box');
        }
        running = true;
        score.value = 0;
        clock.value = 30;
    }

    function chooseNextBox() {
        let tar = Math.floor(60 * Math.random());
        boxes[tar].classList.add('tar-box');
    }
}
