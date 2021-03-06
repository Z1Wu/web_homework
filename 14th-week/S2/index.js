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

	beginBtn.click(robotHandler);

	let xml;
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


	function robotHandler(event) {
		let btns = $('.button');
		let index = 0;
		let order = [0, 1, 2, 3, 4];
		helper($(btns[order[index++]]));
		function helper(button) {
			waitData(button);
			xml = $.get( "/", function(data) {
				hasGotData(button, data);
				randomDataes.push(parseInt(data));
				if(checkFinished()) {
					enableBtn(bigBubble);
					showResultSum(bigBubble, randomDataes);				
				} else {
					helper($(btns[order[index++]]));
				}
			});
		}
	}
	
	// // learn promise....
	// function robotHandler(event) {
	// 	let btns = $('.button');
	// 	let index = 0;
	// 	let order = [0, 1, 2, 3, 4];
	// 	let pushBtn = (function (currentSum, button) {
	// 		return new Promise(function(resolve, reject) {				
	// 			waitData(button);
	// 			$.get( "/", function(data) {
	// 				hasGotData(button, data);
	// 				randomDataes.push(parseInt(data));
	// 				resolve(currentSum + parseInt(data));
	// 			});
	// 		});
	// 	});
	// 	function pushBigBubble(finalSum) {
	// 		enableBtn(bigBubble);
	// 		showMessgaeOnBoard(finalSum);
	// 	};
	// 	pushBtn(0, $(btns[0]))
	// 		.then((currentSum) => pushBtn(currentSum, $(btns[1])))
	// 		.then((currentSum) => pushBtn(currentSum, $(btns[2])))
	// 		.then((currentSum) => pushBtn(currentSum, $(btns[3])))
	// 		.then((currentSum) => pushBtn(currentSum, $(btns[4])))
	// 		.then((finalSum) => pushBigBubble(finalSum))
	// 		.catch((message) => log(message));
	// }

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
		if(xml) xml.abort();
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

	function showMessgaeOnBoard(message) {
		textBoard.text(message);
		disableBtn(bigBubble);
	}

	function getRandomOrder() {
		let res = [];
		while(res.length < 5) {
			let newRandom = Math.floor(5 * Math.random());
			if (res.indexOf(newRandom) === -1) res.push(newRandom);
		}
		return res;
	}
	
	function showOrder(order) {
		let numToLetter = ['A', 'B', 'C', 'D', 'E'];
		textBoard.text(order.map(x => x = numToLetter[x]).join(''));
	}

});
