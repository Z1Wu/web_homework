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

	beginBtn.click(finalHandler);


	function clickHandler(event) {
		let button = $(event.target);
		let btnChild = $(button.children());
		if(button.hasClass('info')) {
			showResultSum(bigBubble, randomDataes);
		} else if (button.hasClass('button') && !hasClicked(button)) {
			btnChild.css({
				opacity: 1,
			});
			btnChild.text('...');
			disableBtn(button);
			$.get( "/", function(data) {
				btnChild.text(data);
				randomDataes.push(parseInt(data));
				if(checkFinished()) {
					enableBtn(bigBubble);
				};
			});
		}
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

	function hasClicked(button) {
		return button.css('background-color') === UNACTIVE_COLOR;
	}

	function init() {
		randomDataes = [];
		let btns = $('.button');
		disableBtn(bigBubble);
		textBoard.text('');
		for(let i = 0; i < btns.length; i++) {
			let tmp = $(btns[i]);
			enableBtn(tmp);
			tmp.children().css({
				opacity: 0,
			});
			tmp.children().text('');			
		}
	}

	
	// S5 终极秘密
	function finalHandler(event) {
		let order = getRandomOrder();
		let funMap = [];
		showOrder(order);
		funMap.push(handlerGenerator({
			"btnIndex" : 0,
			"message": "这不是个天大的秘密",
			"errorMessage" : "这是一个天大的秘密",
		}));
		funMap.push(handlerGenerator({
			"btnIndex" : 1,
			"message": "我知道",
			"errorMessage" : "我不知道",
		}));
		funMap.push(handlerGenerator({
			"btnIndex" : 2,
			"message": "你知道",
			"errorMessage" : "你不知道",
		}));
		funMap.push(handlerGenerator({
			"btnIndex" : 3,
			"message": "他知道",
			"errorMessage" : "他不知道",
		}));
		funMap.push(handlerGenerator({
			"btnIndex" : 4,
			"message": "才怪",
			"errorMessage" : "才不怪",
		}));
		funMap.push(bigBubbleHandler);
		let callbacks = [];
		// generate random order
		for(let i = 0; i < 5; i++) {
			callbacks.push(funMap[order[i]]);
		}
		callbacks.push(bigBubbleHandler);
		callbacks[0](null, 0, 1, callbacks);
	}

	function handlerGenerator(option) {
		return function (err, currentSum, index, callbacks) {
			if(err) {
				showMassageOnBoard(err.message);
			}
			let btn = $($('.button')[option.btnIndex]);
			waitData(btn);
			$.get( "/", function(data) {
				let error = {};
				hasGotData(btn, data);
				if(Math.random() < 0.5) {
					showMassageOnBoard(option.message);
				} else {
					error = {
						'currentSum' : currentSum + parseInt(data),
						"message": option.errorMessage
					};
				}
				callbacks[index](error, currentSum + parseInt(data), index + 1, callbacks);
			});
		}
	}

	function bigBubbleHandler(err, currentSum) {
		if(err) {
			showMassageOnBoard(err.message);
		}
		enableBtn(bigBubble);
		setTimeout(function() {
			disableBtn(bigBubble);
			showMassageOnBoard("楼主异步调用战斗力感人，目测不超过" + currentSum);
		}, 1000);
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
		btn.children().text('...');
	}

	function hasGotData(btn, data) {
		let btns = $('.button');
		// enableBtn all btn which still not get data;
		for(let i = 0; i < btns.length; i++) {
			let tmp = $(btns[i]);
			if(tmp.children().text() == '') {
				enableBtn(tmp);
			}
		}
		disableBtn(btn);
		btn.children().text(data);
	}

	function showResultSum(bubble, resArr) {
		let res = resArr.reduce((a,b)=> a + b);
		textBoard.text(res);
		disableBtn(bubble);
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
		// another bubble should show 
		textBoard.text(order.map(x => x = numToLetter[x]).join(''));
	}
	
	function showMassageOnBoard(message) {
		let textBoard = $('.show-text');
		textBoard.text(message);
	}
});
