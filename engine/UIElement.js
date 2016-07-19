function UIElement() {}

UIElement.prototype.getValue = function() {
	throw 'getValue not defined.  It should return the value for the UIElement to display.';
};

UIElement.prototype.display = function(context) {
	throw 'display not defined.';
};

UIElement.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;
};




SpriteRepeaterUIElement.prototype = Object.create(UIElement.prototype);
SpriteRepeaterUIElement.parent = UIElement.prototype;

function SpriteRepeaterUIElement(sprite_name, sprite_width, sprite_height, padding) {
	this.sprite_width  = sprite_width;
	this.sprite_height = sprite_height;
	this.padding = padding;
	this.sprite = new Sprite(sprite_name);
	this.sprite.init();
}

SpriteRepeaterUIElement.prototype.display = function(context)  {
	var sprite_x = this.x;

	//this.sprite.advanceAnimation(delta);
	
	var value = this.getValue();
	for (var i = 0; i < value; i++) {
		this.sprite.display(sprite_x, this.y, context);
		sprite_x += this.sprite_width + this.padding;
	}
};



TextUIElement.prototype = Object.create(UIElement.prototype);
TextUIElement.parent = UIElement.prototype;

function TextUIElement(font, color) {
	this.font = font;
	this.color = color;
}

// TO-DO: include things like color changes, text align changes, etc.
// Delta also does nothing right now.
TextUIElement.prototype.display = function(context) {
	context.fillStyle = this.color;
	context.textAlign = 'right';
	context.font = this.font;
	context.textBaseline = 'top';
	context.fillText(this.getValue(), this.x, this.y);
};