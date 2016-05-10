/**
 * Birst Game
 */

var STATE = {
	OVER: 0,
	PLAYING: 1
};

var Game = {
	state: STATE.OVER,
	$body: $("body"),
	$square: $("#square"),
	$menu: $(".menu"),
	$timer: $(".timer"),
	$win: $(".win"),
	$lose: $(".lose"),
	loopInterval: null,
	startTime: null,
	currentScore: 0,
	currentLevel: 1,
	currentAngle: {
		top: 1,
		left: 1,
	},
	hasJustUpdatedLevel: false,

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

		this.$menu.fadeIn(75);
		this.$square
			.css({
				top: "",
				left: ""
			})
			.removeClass("playing")
			.addClass("over")
			.off("mouseout")
			.click(this.changeState.bind(this, STATE.PLAYING));

		this.changeLevel(1);

		this.currentScore = 0;
		this.currentAngle.top = Math.random() < .5 ? -1 : 1;
		this.currentAngle.left = Math.random() < .5 ? -1 : 1;
	},

	setupStatePlaying: function() {
		this.$square
			.css({
				top: this.$square.offset().top,
				left: this.$square.offset().left
			})
			.removeClass("over")
			.addClass("playing")
			.off("click")
			.mouseout(this.lose.bind(this))
		this.$menu.fadeOut(150);

		this.start();
	},

	changeLevel: function(newLevel) {
		this.level = newLevel ? newLevel : ++this.level;

		if (this.level > 5) {
			this.win();
			return;
		}

		this.$body.removeClass();
		this.$body.addClass("level-" + this.level);
		this.hasJustUpdatedLevel = true;
	},

	play: function() {
		this.updateSquarePosition();
		this.updateClock();
	},

	win: function() {
		this.$win.fadeIn(75).delay(2000).fadeOut(150);
		this.changeState(STATE.OVER);
	},

	lose: function() {
		this.$lose.fadeIn(75).delay(1000).fadeOut(150);
		this.changeState(STATE.OVER);
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
			newTopAngle = Math.ceil(Math.random() * 2) + this.level,
			newLeftAngle = Math.ceil(Math.random() * 2) + this.level;

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

		switch (elapsedSeconds % 2) {
			case 0:
				if (this.hasJustUpdatedLevel) {
					break;
				}
				this.changeLevel();
				break;
			case 1:
				this.hasJustUpdatedLevel = false;
				break;
		}
	}
};

var Menu = {
	init: function() {
		var $allDifficultyButtons = $(".difficulties .difficulty");

		$allDifficultyButtons.click(function(e) {
			$allDifficultyButtons.removeClass("active");
			$allDifficultyButtons.filter(e.target).addClass("active");

			Game.$square
				.removeClass("standard hard impossible")
				.addClass(e.target.dataset.difficulty);
		});
	}
};

Menu.init();
Game.changeState(STATE.OVER);
