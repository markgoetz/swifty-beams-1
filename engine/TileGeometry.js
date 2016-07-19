function TileGeometry(tile_size, width, height, string, tile_set) {
	this.tile_size = tile_size;
	this.width = width;
	this.height = height;
	this.string = string;
	this.tiles_wide = Math.ceil(this.width / this.tile_size);
	this.tile_set = game.tile_map.getTileSet(tile_set);
}

TileGeometry.prototype.checkPixel = function(x, y) {
	if (x < 0 || y < 0 || x > this.width || y > this.height)
		return false;
	
	var tile_x = Math.floor(x / this.tile_size);
	var tile_y = Math.floor(y / this.tile_size);
	
	if (this._getTileAt(tile_x, tile_y) != ' ') return true;
	return false;
};

TileGeometry.prototype.collisionCheck = function(actor) {
	var hitbox = actor.getHitbox();
	var prev_hitbox = actor.getPreviousHitbox();
	
	
	for (var check_x = hitbox.x; check_x < hitbox.right_x() + this.tile_size; check_x += this.tile_size) {
		for (var check_y = hitbox.y; check_y < hitbox.bottom_y() + this.tile_size; check_y += this.tile_size) {
			if (check_x > hitbox.right_x())  check_x = hitbox.right_x();
			if (check_y > hitbox.bottom_y()) check_y = hitbox.bottom_y();
			
			if (this.checkPixel(check_x, check_y)) {
				// figure out the side.
				// Step 1: Determine which tile the current and previous collision points are in.
				var x_offset = check_x - hitbox.x;
				var y_offset = check_y - hitbox.y;
				
				var previous_x = prev_hitbox.x + x_offset;
				var previous_y = prev_hitbox.y + y_offset;
				
				var tile_x = Math.floor(check_x / this.tile_size);
				var tile_y = Math.floor(check_y / this.tile_size);
				var old_tile_x = Math.floor(previous_x / this.tile_size);
				var old_tile_y = Math.floor(previous_y / this.tile_size);
				
				// detect which side the collision was on.
				// If this is an internal edge (i.e. there is another tile directly adjacent), ignore the collision.
				var side = new CollisionSides();
				if (tile_y < old_tile_y && this._getTileAt(tile_x, old_tile_y) == ' ') {
					side.setSide(CollisionSides.sides.TOP);
				}
				else if (tile_y > old_tile_y && this._getTileAt(tile_x, old_tile_y) == ' ') {
					side.setSide(CollisionSides.sides.BOTTOM);
				}
				
				if (tile_x < old_tile_x && this._getTileAt(old_tile_x, tile_y) == ' ') {
					side.setSide(CollisionSides.sides.LEFT);
				}
				else if (tile_x > old_tile_x && this._getTileAt(old_tile_x, tile_y) == ' ') {
					side.setSide(CollisionSides.sides.RIGHT);
				}
								
				// set the rectangle so that the actor knows where the boundary of the geometry is.
				var tile = new LevelTile(tile_x * this.tile_size, tile_y * this.tile_size, this.tile_size, this._getTileAt(tile_x, tile_y));
				actor.oncollide(tile, side);
				
			}
		}
	}
};

TileGeometry.prototype._getTileAt = function(tile_x, tile_y) {
	return this.string.charAt(tile_y * this.tiles_wide + tile_x);
};

TileGeometry.prototype.display = function(x, y, context) {	
	var display_x = x, display_y = y;
	
	for (var i = 0; i < this.string.length; i++) {
		var tile_id = this.string.charAt(i);
		
		if (tile_id != ' ')
			this.tile_set.display(display_x, display_y, tile_id, context);
		
		display_x += this.tile_size;
		if (display_x >= game.WINDOW_WIDTH) {
			display_x = x;
			display_y += this.tile_size;
		}
	}
};

TileGeometry.prototype.getTileSize = function() {
	return this.tile_size;
};

LevelTile.prototype = Object.create(Actor.prototype);
LevelTile.parent = Actor.prototype;
function LevelTile(x, y, tile_size, id) {
	this.constructor(new Rectangle(0, 0, tile_size, tile_size), null);
	this.init(x, y, 'null');
	this.id = id;
}

LevelTile.prototype.init = function(x, y) {
	this.x = x;
	this.y = y;
};
