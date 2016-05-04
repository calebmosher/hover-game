/**
 * Birst Game
 *
 * Stuff.
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

	start: function() {
		this.startTime = new Date();
		this.loopInterval = window.setInterval(function() {
			if (this.state !== STATE.PLAYING) {
				return;
			}

			this.play();
		}.bind(this), 50);
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
		console.log(this.loopInterval);
		window.clearInterval(this.loopInterval);

		this.$square
			.addClass("start")
			.off("mouseout")
			.click(this.changeState.bind(this, STATE.PLAYING))
			.css({position: "static"});
		this.$menu.fadeIn(60);

		this.currentScore = 0;
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

	},

	updateClock: function() {
		var currentTime = new Date(),
			elapsedSeconds = "" + Math.floor((currentTime - this.startTime) / 100);

		elapsedSeconds = elapsedSeconds.substr(0, elapsedSeconds.length - 1) + "." + elapsedSeconds[elapsedSeconds.length - 1];

		this.$timer.html(elapsedSeconds);
		this.currentScore = elapsedSeconds;
	},

};

Game.changeState(STATE.OVER);
