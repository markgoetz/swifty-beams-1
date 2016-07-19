function TileSet(file_name, tiles) {
	this.file_name = 'tiles/' + file_name;
	this.tiles = tiles;
	
	this.image = new Image();
	
	this.image.onload = function(event) {
		this.loaded = true;
	};
	
	this.image.src = this.file_name;
}

TileSet.prototype.isLoaded = function() {
	return this.image.loaded;
};

TileSet.prototype.display = function(x, y, id, context) {
	var tile_rect = this.tiles[id];
	
	if (!tile_rect) return;
		
	var camera_x = game.game_engine.camera_x;
	var camera_y = game.game_engine.camera_y;
	
	context.drawImage(this.image,
		tile_rect.x, tile_rect.y, tile_rect.width, tile_rect.height,
		x - camera_x, y - camera_y, tile_rect.width, tile_rect.height
	);
};

TileSet.prototype.getCount = function() {
	return this.tiles.length;
};


function TileSetMap() {
	this.tile_sets = {};
}

TileSetMap.prototype.addTileSet = function(name, tile_set) {
	if (this.tile_sets[name])
		throw 'Duplicate tileset name:' + name;
	
	if (!tile_set instanceof TileSet)
		throw 'tile_set is not a tile_set';
	
	this.tile_sets[name] = tile_set;
	game.game_engine.preloader.registerItem(tile_set);
};

TileSetMap.prototype.getTileSet = function(name) {
	return this.tile_sets[name];
};

TileSetMap.prototype.getTileSetNames = function() {
	return Object.keys(this.tile_sets);
};

TileSetMap.prototype.getCount = function() {
	return Object.keys(this.tile_sets).length;
};