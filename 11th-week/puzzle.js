//render the picture
$(function () {
    let main_area = $('.main-area');
    (function () {
        for (let i = 0; i < 16; i++) {
                let pos_x = Math.floor(i / 4);
                let pos_y = i % 4;
                let tmp = i + 1;
                let img_num = tmp < 10 ? "00" + tmp : "0" + tmp;
                let img_path = './assets/image_part_' + img_num + '.jpg';
                let new_box = $('<div></div>');
                new_box.css({
                    "background-image": "url(" + img_path + ")",
                    "width": "110px",
                    "height": "110px",
                    "position": "absolute",
                    "left": pos_y * 110 + "px",
                    "top": pos_x * 110 + "px"
                });
                if(i === 15) {
                    new_box.css('background-image', 'none');
                }
                new_box.attr('id', i);
                new_box.addClass('boxes');
                main_area.append(new_box);
            }
    })();

    let operator_sequence = [];
    let speed = "quick";
    //state
    let moving = false;
    let getting_solution = false;
    let restarting = false;

    let arr_box = $('.boxes');
    let puzzle_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    $('.speed_label').addClass('disappear');
    $('.massage').addClass('disappear');
    $('.speed').val('200');


    main_area.click(function(event) {
        let cur_id = event.target.id;
        if(isValid(cur_id)) {
            move(cur_id);
        }
    });

    $('.solution').click(function() {
        getSolution("quick");
    });

    $('.start').click(function() {
        start();
    });

    function init() {
        for(let i = 0; i < 16; i++) {
            puzzle_map[i] = i;
            let pos_x = Math.floor(i / 4);
            let pos_y = i % 4;
            $(arr_box[i]).css({
                "left": pos_y * 110 + "px",
                "top": pos_x * 110 + "px"
            });
        }
        operator_sequence = [];
        speed = "quick";
        level =  1;
        moving = false;
        getting_solution = false;
        restarting = false;
    }

    function isValid (cur_id) {
        let cur_pos = puzzle_map[cur_id];
        let cur_pos_x = cur_pos % 4;
        let cur_pos_y = Math.floor(cur_pos / 4);
        let blank_pos_x = puzzle_map[15] % 4;
        let blank_pos_y = Math.floor(puzzle_map[15] / 4);
        return Math.abs(cur_pos_x - blank_pos_x) +  Math.abs(cur_pos_y - blank_pos_y) === 1;
    }

    function move (cur) {
        if(moving) {
            return;
        }
        $('.massage').addClass('disappear');
        cur = parseInt(cur);
        let tmp = puzzle_map[cur];
        puzzle_map[cur] = puzzle_map[15];
        puzzle_map[15] = tmp;
        let cur_box = $(arr_box[cur]);
        let blank_box = $(arr_box[15]);
        let cur_left = parseInt(cur_box.css('left'));
        let cur_top = parseInt(cur_box.css('top'));
        let blank_left = parseInt(blank_box.css('left'));
        let blank_top = parseInt(blank_box.css('top'));
        if(!getting_solution) {
            if(operator_sequence[operator_sequence.length - 1] === cur) {
                operator_sequence.pop();
            } else {
                operator_sequence.push(cur);
            }
        }
        moving = true;
        blank_box.css('left', cur_left + "px");
        blank_box.css('top', cur_top + "px");
        cur_box.animate({
            left: blank_left + "px",
            top: blank_top + "px"
        }, speed, function () {
            moving = false;
            if(!restarting && succeed()) {
                $('.massage').removeClass('disappear');
            }
            if(getting_solution) {
                if(operator_sequence.length === 0) {
                    getting_solution = false;
                    $('.speed_label').addClass('disappear');
                    $('.speed').val('200');
                } else {
                    speed = 2000 - parseInt($('.speed').val());
                    console.log(speed);
                    move(operator_sequence.pop());
                }
            }
            if(restarting) {
                move(get_next_random_move());
                if(operator_sequence.length === 30) {
                    restarting = false;
                    speed = "quick";
                }
            }
        });
    }

    function get_next_random_move() {
        while(1) {
            let next_move = get_random_between(0, 15);
            if(isValid(next_move)) {
                return next_move;
            }
        }
    }

    function succeed() {
        for(let i = 0; i < 16; i++) {
            if(i !== puzzle_map[i]) {
                return false;
            }
        }
        operator_sequence = [];
        return true;
    }

    function get_random_between(a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a;
    }

    function start() {
        if(!restarting){
            init();
            speed = 0;
            restarting = true;
            move(get_next_random_move());
        }
    }

    function getSolution() {
        if(!getting_solution && !succeed()) {
            $('.speed_label').removeClass('disappear');
            speed = 2000 - parseInt($('.speed').val());
            getting_solution = !getting_solution;
            move(operator_sequence.pop());
        }
    }

});

