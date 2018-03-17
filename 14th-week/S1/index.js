$(function() {
	let log = console.log;
	let apb = $('#button');
	let bigBubble = $('.info');
	let beginBtn = $('.apb');
	let textBoard = $('.show-text');
	let randomDataes = [];
	const ACTIVE_COLOR = "rgb(48, 63, 159)",
		  UNACTIVE_COLOR = "rgb(128, 128, 128)";

	apb.click(clickHandler);
	apb.hover(init);

	function clickHandler(event) {
		let button = $(event.target);
		if(button.hasClass('info')) {
			showResultSum(button, randomDataes);
		} else if (button.hasClass('button') && !hasClicked(button)) {
			waitData(button);
			$.get( "/", function(data) {
				hasGotData(button, data);
				randomDataes.push(parseInt(data));
				if(checkFinished()) {
					enableBtn(bigBubble);
				};
			});
		}
	}

	function hasClicked(button) {
		return button.css('background-color') === UNACTIVE_COLOR;
	}

	function enableBtn(btn) {
		btn.css({
			'background-color' : ACTIVE_COLOR,
			'cursor' : 'pointer'
		});
	}

	function disableBtn(btn) {
		btn.css({
			'background-color' : UNACTIVE_COLOR,
			'cursor' : 'default'
		});	
	}

	function init() {
		randomDataes = [];
		let btns = $('.button');
		disableBtn(bigBubble);
		textBoard.text(' ');
		for(let i = 0; i < btns.length; i++) {
			let tmp = $(btns[i]);
			enableBtn(tmp);
			tmp.children().css({
				opacity: 0,
			});
			tmp.children().text('');			
		}
	}

	function waitData(btn) {
		let btns = $('.button');
		// disable all btn;
		for(let i = 0; i < btns.length; i++) {
			disableBtn($(btns[i]));
		}
		enableBtn(btn);
		btn.children().css({
			opacity: 1,
		});	
		btn.css({
			'cursor' : 'default'
		});
		btn.children().text('...');
	}

	function hasGotData(btn, data) {
		let btns = $('.button');
		// enableBtn all btn which have not got data;
		for(let i = 0; i < btns.length; i++) {
			let tmp = $(btns[i]);
			if(tmp.children().text() == '') {
				enableBtn(tmp);
			}
		}
		btn.children().text(data);
		disableBtn(btn);
	}

	function showResultSum(bubble, resArr) {
		let res = resArr.reduce((a,b)=> a + b);
		textBoard.text(res);
		disableBtn(bubble);
	}

	function checkFinished() {
		return randomDataes.length == 5;
	}
});
