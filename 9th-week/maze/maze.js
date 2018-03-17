(function() {
    window.onload = main;
    function main() {
        let running = false;
        let moveout = false;
        let message = document.getElementsByClassName('tip')[0];
        let mainArea = document.getElementsByClassName('maze-area')[0];
        mainArea.addEventListener('mouseover', Handler);

        function Handler(event) {
            let item = event.target;
            if(item.classList.contains('wall')) {
                if(running) {
                    message.innerText = 'You Lose!';
                    moveout = false;
                    running = false;
                }
            }
            else if (item.classList.contains('end')) {
                if(running && moveout) {
                    message.innerText = 'Don\'t cheat, you should start from the\'S\' and move to the \'E\' inside the maze!';
                    running = false;
                    moveout = false;
                } else if (running && !moveout) {
                    message.innerText = 'You Win!';
                    running = false;
                    moveout = false;
                }
            }
            else if (item.classList.contains('begin')) {
                message.innerText = '';
                running = true;
                moveout = false;
            }
            else if (item.classList.contains('checker')) {
                if(running) {
                    moveout = true;
                }
            }
        }
    }
})();