/**
 * Birst Game
 */

var STATE = {
	OVER: 0,
	PLAYING: 1
};

var Game = {
	state: STATE.OVER,
	$square: $("#square"),
	$menu: $(".menu"),
	$timer: $(".timer"),
	loopInterval: null,
	startTime: null,
	currentScore: 0,
	previousTop: 0,
	previousLeft: 0,

	start: function() {
		this.startTime = new Date();
		this.loopInterval = window.setInterval(function() {
			if (this.state !== STATE.PLAYING) {
				return;
			}

			this.play();
		}.bind(this), 100);
	},

	changeState: function(newState) {
		this.state = newState;

		switch (newState) {
			case STATE.OVER:
				this.setupStateOver();
				break;
			case STATE.PLAYING:
				this.setupStatePlaying();
				break;
		}
	},

	setupStateOver: function() {
		window.clearInterval(this.loopInterval);

		this.$square
			.addClass("start")
			.off("mouseout")
			.click(this.changeState.bind(this, STATE.PLAYING))
			.css({position: "static"});
		this.$menu.fadeIn(60);

		this.currentScore = 0;
		this.previousTop = 0;
		this.previousLeft = 0;
	},

	setupStatePlaying: function() {
		this.$square
			.removeClass("start")
			.off("click")
			.mouseout(this.changeState.bind(this, STATE.OVER))
			.css({
				position: "absolute",
				top: this.$square.offset().top,
				left: this.$square.offset().left
			});
		this.$menu.fadeOut(120);

		this.start();
	},

	play: function() {
		this.updateSquarePosition();
		this.updateClock();
	},

	updateSquarePosition: function() {
		var currentTop = parseInt(this.$square.css("top")),
			currentLeft = parseInt(this.$square.css("left")),
			topDirection = currentTop - this.previousTop > 0 ? 1 : -1,
			leftDirection = currentLeft - this.previousLeft > 0 ? 1 : -1,
			topUpperBound = $(window).height() - this.$square.height(),
			leftUpperBound = $(window).width() - this.$square.width(),
			newTop,
			newLeft;

		newTop = currentTop + (topDirection * Math.ceil(Math.random() * 4) * 6);
		newLeft = currentLeft + (leftDirection * Math.ceil(Math.random() * 4) * 6);

		if (newTop > topUpperBound || newTop < 0) {
			newTop = currentTop + ((newTop - currentTop) * -1);
		}
		if (newLeft > leftUpperBound || newLeft < 0) {
			newLeft = currentLeft + ((newLeft - currentLeft) * -1);
		}

		this.$square.animate({
			top: newTop,
			left: newLeft
		}, 90);

		this.previousTop = currentTop;
		this.previousLeft = currentLeft;
	},

	updateClock: function() {
		var currentTime = new Date(),
			elapsedSeconds = "" + Math.floor((currentTime - this.startTime) / 100);

		elapsedSeconds = elapsedSeconds.substr(0, elapsedSeconds.length - 1) + "." + elapsedSeconds[elapsedSeconds.length - 1];

		this.$timer.html(elapsedSeconds);
		this.currentScore = elapsedSeconds;
	}

};

Game.changeState(STATE.OVER);
