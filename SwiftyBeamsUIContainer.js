SwiftyBeamsUIContainer.prototype = Object.create(UIElementContainer.prototype);
SwiftyBeamsUIContainer.parent = UIElementContainer.prototype;

SwiftyBeamsUIContainer.HEIGHT = 32;

function SwiftyBeamsUIContainer() {
	this.constructor(new Rectangle(0, game.WINDOW_HEIGHT - SwiftyBeamsUIContainer.HEIGHT, game.WINDOW_WIDTH, SwiftyBeamsUIContainer.HEIGHT));
	this.addUIElement(new SwiftyBeamsBestCounter(), game.WINDOW_WIDTH - 24, 16);
	this.addUIElement(new SwiftyBeamsScoreCounter(), 48, 16);
	this.addUIElement(new SwiftyBeamsVolumeDisplay(), (game.WINDOW_WIDTH - 21 * SwiftyBeams.BAR_WIDTH) / 2, 0);
};

SwiftyBeamsUIContainer.prototype.displayBackground = function(context) {
	context.fillStyle = '#000000';
	context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
	
	context.font = '16px Silkscreen';
	context.fillStyle = '#ffffff';
	context.textAlign = 'left';
	context.fillText('SCORE', 8, this.rect.y);
	context.textAlign = 'right';
	context.fillText('BEST', this.rect.width - 8, this.rect.y);
};

SwiftyBeamsUIContainer.prototype.showVolume = function() {
	this.elements[2].turnOn();
};

SwiftyBeamsUIContainer.prototype.step = function(delta) {
	this.elements[2].step(delta);
};