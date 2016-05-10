/**
 * @module HoverGame
 */


/**
 * Game state globals
 */
var STATE = {
	OVER: 0,
	PLAYING: 1
};


/**
 * @class Game
 * Controls game mechanics and flow.
 */
var Game = {
	/* ---------------------------------------- *\
	 * Init
	\* ---------------------------------------- */

	state: STATE.OVER,
	loopInterval: null,
	startTime: null,
	currentScore: 0,
	currentLevel: 1,
	currentAngle: {
		top: 1,
		left: 1,
	},
	hasJustUpdatedLevel: false,
	levelTimeLength: 10,



	/* ---------------------------------------- *\
	 * Elements
	\* ---------------------------------------- */

	$body: $("body"),
	$square: $("#square"),
	$timer: $(".timer"),
	$win: $(".win"),
	$lose: $(".lose"),



	/* ---------------------------------------- *\
	 * Setup
	\* ---------------------------------------- */

	/**
	 * @method setupStateOver
	 * Reset elements and fields for game over case, bring back up menu
	 */
	setupStateOver: function() {
		window.clearInterval(this.loopInterval);

		Menu.$menu.fadeIn(75);
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

	/**
	 * @method setupStatePlaying
	 * Remove menu, transition square to game square, and run game
	 */
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
		Menu.$menu.fadeOut(150);

		this.start();
	},



	/* ---------------------------------------- *\
	 * Control Flow
	\* ---------------------------------------- */

	/**
	 * @method changeState
	 * Change the current state of the game to new state
	 *
	 * @param newState {str} Constant property of STATE object to change game state to
	 */
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

	/**
	 * @method changeLevel
	 * Change the current level of the game to new level if provided, else increment current level
	 *
	 * @param newLevel {int} New level to change game to
	 */
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

	/**
	 * @method start
	 * Set up and run the main game loop
	 */
	start: function() {
		this.startTime = new Date();
		this.loopInterval = window.setInterval(function() {
			if (this.state !== STATE.PLAYING) {
				return;
			}

			this.play();
		}.bind(this), 15);
	},

	/**
	 * @method play
	 * Game loop iterator, gets called on every loop iteration
	 */
	play: function() {
		this.updateSquarePosition();
		this.updateClock();
	},

	/**
	 * @method win
	 * Show winning message and end game
	 */
	win: function() {
		this.$win.fadeIn(75).delay(2000).fadeOut(150);
		this.changeState(STATE.OVER);
	},

	/**
	 * @method lose
	 * Show losing message and end game
	 */
	lose: function() {
		this.$lose.fadeIn(75).delay(1000).fadeOut(150);
		this.changeState(STATE.OVER);
	},



	/* ---------------------------------------- *\
	 * Game Loop Updaters
	\* ---------------------------------------- */

	/**
	 * @method updateSquarePosition
	 * Move the square
	 */
	updateSquarePosition: function() {
		var currentTop = parseInt(this.$square.css("top")),
			currentLeft = parseInt(this.$square.css("left")),
			newTop,
			newLeft;

		this.updateAngle(currentTop, currentLeft);

		newTop = currentTop + this.currentAngle.top,
		newLeft = currentLeft + this.currentAngle.left;

		this.$square.css({
			top: newTop,
			left: newLeft
		});
	},

	/**
	 * @method updateAngle
	 * Check if square is in bounds, else change direction
	 *
	 * @param currentTop {int} Current top position of square in pixels
	 * @param currentLeft {int} Current left position of square in pixels
	 */
	updateAngle: function(currentTop, currentLeft) {
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

	/**
	 * @method updateClock
	 * Run the timer, update the game level if necessary
	 */
	updateClock: function() {
		var currentTime = new Date(),
			elapsedSeconds = "" + Math.floor((currentTime - this.startTime) / 100);

		elapsedSeconds = elapsedSeconds.substr(0, elapsedSeconds.length - 1) + "." + elapsedSeconds[elapsedSeconds.length - 1];

		this.$timer.html(elapsedSeconds);
		this.currentScore = elapsedSeconds;

		switch (elapsedSeconds % this.levelTimeLength) {
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



/**
 * @class Menu
 * Handlers for menu items
 */
var Menu = {
	/* ---------------------------------------- *\
	 * Init
	\* ---------------------------------------- */

	$menu: $(".menu"),
	$allDifficultyButtons: $(".difficulties .difficulty"),

	/**
	 * @method init
	 * Attach menu listeners
	 */
	init: function() {
		this.$allDifficultyButtons.click(function(e) {
			this.$allDifficultyButtons.removeClass("active");
			this.$allDifficultyButtons.filter(e.target).addClass("active");

			Game.$square
				.removeClass("standard hard impossible")
				.addClass(e.target.dataset.difficulty);
		}.bind(this));
	}
};



Menu.init();
Game.changeState(STATE.OVER);
