(function () {
    'use strict';
    var is_time_to_reset = true;

    console.log(abc);
    window.onload = function() {
        var keyBoard = getKeyBoards = document.getElementById("keyboard");
        keyBoard.addEventListener('click', clickHandler);
    };

    function clickHandler(event) {
        var element = event.target;
        var text = element.innerText;
        switch (text) {
            case "ce":
                reset();
                break;
            case "←":
                back();
                break;
            case "=":
                calculate();
                break;
            default:
                click(text);
        }
    }

    function reset () {
        document.getElementById('input-box').innerText = "0";
    }

    function back() {
        var text = document.getElementById('input-box').innerText;
        var result = text.slice(0, -1);
        if(result === "") { 
            result = "0";
        }
        document.getElementById('input-box').innerText = result;
    }

    function click(text) {
        if(is_time_to_reset) {
            document.getElementById('input-box').innerText = "";
            is_time_to_reset = false;
        }
        document.getElementById('input-box').innerText += text;
    }

    function calculate() {
        var expression = document.getElementById('input-box').innerText;
        try {
            document.getElementById('input-box') = getResult(expression);
            is_time_to_reset = true;
        } catch (e) {
            reset();
            alert(e);
        }
    }

    function getResult(expression) {
        // var RPN
    }
})();