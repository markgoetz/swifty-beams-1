SwiftyBeamsLevel.prototype = Object.create(Level.prototype);
SwiftyBeamsLevel.parent = Level.prototype;

SwiftyBeamsLevel.TILE_SIZE = 32;
SwiftyBeamsLevel.INITIAL_EMPTY_ROWS = 8;
SwiftyBeamsLevel.INITIAL_ROWS = 4;
SwiftyBeamsLevel.GAP_CHANCE = .15;

function SwiftyBeamsLevel(geometry_initializer) {
	this.constructor(null, '', 'background');
	this.triggers = [];
}

SwiftyBeamsLevel.prototype.initObjects = function() {

};

SwiftyBeamsLevel.prototype.initBackground = function() {
	SwiftyBeamsLevel.parent.initBackground.call(this);
	this.background_image.setParallax(.5);
};

SwiftyBeamsLevel.prototype.initGeometry = function() {
	this.geometry = new TileGeometry(SwiftyBeamsLevel.TILE_SIZE, game.WINDOW_WIDTH, game.WINDOW_HEIGHT, '', 'wall');
	
	for (var i = 0; i < SwiftyBeamsLevel.INITIAL_EMPTY_ROWS * 10; i++) {
		this.geometry.string = this.geometry.string + ' ';
	}
	
	for (var i = 0; i < SwiftyBeamsLevel.INITIAL_ROWS; i++) {
		this.addRow();
	}
};

SwiftyBeamsLevel.prototype.addRow = function() {
	var tiles_wide = this.geometry.tiles_wide;
	
	var empty_row = '';
	
	// start out with an empty row.
	for (var i = 0; i < tiles_wide; i++) {
		empty_row = empty_row + ' ';
	}
	
	var second_row = '';
	do {
		second_row = '';
		
		for (var i = 0; i < tiles_wide; i++) {
			if (Math.random() < SwiftyBeamsLevel.GAP_CHANCE)
				second_row = second_row + ' ';
			else
				second_row = second_row + '0';
		}
		
	} while (!second_row.match(/ 0+ /)); // must be at least two gaps, with one tile between them.
	
	var new_second_row = '';
	for (var i = 0; i < tiles_wide; i++) {
		var tile = second_row.charAt(i);
		if (tile == ' ') {
			new_second_row = new_second_row + ' ';
			continue;
		}
		
		var space_left = false;
		var space_right = false;
		if (i == 0 || second_row.charAt(i - 1) == ' ') space_left = true;
		if (i == tiles_wide -1 || second_row.charAt(i + 1) == ' ') space_right = true;
		
		var replace_char = 2;
		if (space_left && space_right) replace_char = 0;
		if (space_left && !space_right) replace_char = 1;
		if (!space_left && space_right) replace_char = 3;
		
		new_second_row = new_second_row + replace_char;
	}
	
	this.geometry.string = this.geometry.string + empty_row + new_second_row;
	this.geometry.height += 2 * SwiftyBeamsLevel.TILE_SIZE;
	
	var row_count = this.geometry.string.length / tiles_wide;
	var y = (row_count * SwiftyBeamsLevel.TILE_SIZE) + (SwiftyBeamsLevel.TILE_SIZE - 2);
	
	var laser_trigger = new LaserTrigger();
	laser_trigger.init(0, y);
	this.triggers.push(laser_trigger);
	
	var score_trigger = new ScoreTrigger();
	score_trigger.init(0, y + 3 + Player.HEIGHT);
	this.triggers.push(score_trigger);
};
