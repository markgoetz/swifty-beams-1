function SpriteSheet(file_name, animations) {
	this.file_name = 'sprites/' + file_name;
	this.animations = animations;

	this.image = new Image();
	
	this.image.onload = function(event) {
		this.loaded = true;
	};
	
	this.image.src = this.file_name;
}

SpriteSheet.prototype.isLoaded = function() {
	return this.image.loaded;
};

function SpriteSheetMap() {
	this.sprite_sheets = {};
}

SpriteSheetMap.prototype.addSpriteSheet = function(name, sprite_sheet) {
	if (this.sprite_sheets[name])
		throw 'Duplicate spritesheet name:' + name;
	
	if (!sprite_sheet instanceof SpriteSheet)
		throw 'sprite_sheet is not a sprite sheet';
	
	this.sprite_sheets[name] = sprite_sheet;
	game.game_engine.preloader.registerItem(sprite_sheet);
};

SpriteSheetMap.prototype.getSpriteSheet = function(name) {
	return this.sprite_sheets[name];
};

SpriteSheetMap.prototype.getSpriteNames = function() {
	return Object.keys(this.sprite_sheets);
};

SpriteSheetMap.prototype.getCount = function() {
	return Object.keys(this.sprite_sheets).length;
};