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
	currentAngle: {
		top: 1,
		left: 1,
	},

	start: function() {
		this.startTime = new Date();
		this.loopInterval = window.setInterval(function() {
			if (this.state !== STATE.PLAYING) {
				return;
			}

			this.play();
		}.bind(this), 15);
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
			newTop,
			newLeft;

		this.setAngle(currentTop, currentLeft);

		newTop = currentTop + this.currentAngle.top,
		newLeft = currentLeft + this.currentAngle.left;

		this.$square.css({
			top: newTop,
			left: newLeft
		});
	},

	setAngle: function(currentTop, currentLeft) {
		var topUpperBound = $(window).height() - this.$square.height(),
			leftUpperBound = $(window).width() - this.$square.width(),
			newTopAngle = Math.ceil(Math.random() * 2),
			newLeftAngle = Math.ceil(Math.random() * 2);

		if (currentTop > topUpperBound || currentTop < 0) {
			this.currentAngle.top = newTopAngle * Math.sign(this.currentAngle.top) * -1;
		}
		if (currentLeft > leftUpperBound || currentLeft < 0) {
			this.currentAngle.left = newLeftAngle * Math.sign(this.currentAngle.left) * -1;
		}
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
