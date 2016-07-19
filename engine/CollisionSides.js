CollisionSides.sides = {
	TOP: 1,
	LEFT: 2,
	RIGHT: -2,
	BOTTOM: -1
};

function CollisionSides() {
	this.collisions = {
		1: false,
		"-1": false,
		2: false,
		"-2": false
	};
}

CollisionSides.prototype.setSide = function(direction) {
	this.collisions[direction] = true;
};

CollisionSides.prototype.getSide = function(direction) {
	return this.collisions[direction];	
};

CollisionSides.prototype.removeSide = function(direction) {
	this.collisions[direction] = false;
};
