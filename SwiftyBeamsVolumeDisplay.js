SwiftyBeamsVolumeDisplay.prototype = Object.create(UIElement.prototype);
SwiftyBeamsVolumeDisplay.parent = UIElement.prototype;

SwiftyBeamsVolumeDisplay.RGB = '0,255,0';
SwiftyBeamsVolumeDisplay.VISIBLE = .8;
SwiftyBeamsVolumeDisplay.FADEOUT = .7;
SwiftyBeamsVolumeDisplay.HEIGHT = 32;
SwiftyBeamsVolumeDisplay.BAR_WIDTH = 16;

function SwiftyBeamsVolumeDisplay() {
	UIElement.call(this);
	this.fade_delay = 0;
}

SwiftyBeamsVolumeDisplay.prototype.step = function(delta) {
	if (this.fade_delay > 0) {
		this.fade_delay -= delta;
		
		if (this.fade_delay < 0) this.fade_delay = 0; 
	}
};

SwiftyBeamsVolumeDisplay.prototype.display = function(context) {
	if (this.fade_delay == 0) return;
	
	var alpha;
	
	if (this.fade_delay > SwiftyBeamsVolumeDisplay.FADEOUT)
		alpha = 1;
	else
		alpha = (this.fade_delay * SwiftyBeamsVolumeDisplay.FADEOUT);
	
	var volume = game.game_engine.getVolume();
	
	var x = 0;
	var rgba_color = 'rgba(' + SwiftyBeamsVolumeDisplay.RGB + ',' + alpha + ')';
	context.fillStyle = rgba_color;

	for (var i = 0; i < volume; i++) {
		context.fillRect(this.x + x, this.y, SwiftyBeamsVolumeDisplay.BAR_WIDTH, SwiftyBeamsVolumeDisplay.HEIGHT);
		x += SwiftyBeamsVolumeDisplay.BAR_WIDTH * 2;
	}
};

SwiftyBeamsVolumeDisplay.prototype.turnOn = function() {
	this.fade_delay = SwiftyBeamsVolumeDisplay.VISIBLE + SwiftyBeamsVolumeDisplay.FADEOUT;
};
