function SwiftyBeams() {
	this.constructor('SwiftyBeamsPreloader');
}

SwiftyBeams.prototype = Object.create(Game.prototype);
SwiftyBeams.parent = Game.prototype;

function init() {
	game = new SwiftyBeams();
	game.init();
}

Game.prototype.initResolution = function() {
	this.WINDOW_HEIGHT = 320;
	this.WINDOW_WIDTH = 320;
	this.FRAME_RATE = 60;
};

SwiftyBeams.prototype.initLevelMap = function() {
	this.level_map = new SwiftyBeamsLevelMap();
};

SwiftyBeams.prototype.initUI = function() {
	this.ui_container = new SwiftyBeamsUIContainer();
};

SwiftyBeams.prototype.initGamePhases = function() {
	this.game_phase_map.addPhase('title', 'TitlePhase', ['run']);
	this.game_phase_map.addPhase('run', 'GameRunPhase', ['pause','gameover']);
	this.game_phase_map.addPhase('pause', 'PausePhase', ['run']);
	this.game_phase_map.addPhase('gameover', 'GameOverPhase', ['run']);
	
	this.initPhase('title');
};

SwiftyBeams.prototype.initSpriteSheets = function() {	
	this.sprite_sheet_map.addSpriteSheet('laser', new SpriteSheet(
		'laser.png',
		[new Animation(
			'static',
			[
			 new Frame(new Rectangle(0, 0, Laser.WIDTH, Laser.HEIGHT), 1)
			],
			true
		)]
	));
	
	this.sprite_sheet_map.addSpriteSheet('trigger', new SpriteSheet(
		'trigger.png',
		[new Animation(
			'static',
			[
			 new Frame(new Rectangle(0, 0, LaserTrigger.WIDTH, LaserTrigger.HEIGHT), 1)
			],
			true
		)]
	));	
	
	this.sprite_sheet_map.addSpriteSheet('player', new SpriteSheet(
		'player.png',
		[
			new Animation(
				'standright',
				[
					new Frame(new Rectangle(Player.WIDTH,0,Player.WIDTH,Player.HEIGHT), 1)
				]
			),
			new Animation(
				'standleft',
				[
					new Frame(new Rectangle(0,0,Player.WIDTH,Player.HEIGHT), 1)
				]
			),
			new Animation(
				'fallright',
				[
					new Frame(
						new Rectangle(Player.WIDTH,Player.HEIGHT*4,Player.WIDTH,Player.HEIGHT),
						1
					)
				]
			),
			new Animation(
				'fallleft',
				[
					new Frame(
						new Rectangle(0, Player.HEIGHT*4,Player.WIDTH,Player.HEIGHT),
						1
					)
				]
			),
			new Animation(
				'walkright',
				[
					new Frame(new Rectangle(Player.WIDTH,Player.HEIGHT*2,Player.WIDTH,Player.HEIGHT), .1),
					new Frame(new Rectangle(Player.WIDTH,Player.HEIGHT*1,Player.WIDTH,Player.HEIGHT), .1),
					new Frame(new Rectangle(Player.WIDTH,Player.HEIGHT*3,Player.WIDTH,Player.HEIGHT), .1),
					new Frame(new Rectangle(Player.WIDTH,Player.HEIGHT*1,Player.WIDTH,Player.HEIGHT), .1),
				],
				true
			),
			new Animation(
				'walkleft',
				[
					new Frame(new Rectangle(0,Player.HEIGHT*2,Player.WIDTH,Player.HEIGHT), .1),
					new Frame(new Rectangle(0,Player.HEIGHT*1,Player.WIDTH,Player.HEIGHT), .1),
					new Frame(new Rectangle(0,Player.HEIGHT*3,Player.WIDTH,Player.HEIGHT), .1),
					new Frame(new Rectangle(0,Player.HEIGHT*1,Player.WIDTH,Player.HEIGHT), .1),
				],
				true
			),

		]
	));
};

SwiftyBeams.prototype.initTiles = function() {
	this.tile_map.addTileSet('wall', new TileSet(
		'platforms.png',
		[
			new Rectangle(0,0,32,32),
			new Rectangle(32,0,32,32),
			new Rectangle(64,0,32,32),
			new Rectangle(96,0,32,32)
		]
	));
};

SwiftyBeams.prototype.initBackgroundImages = function() {
	this.background_image_map.addBackgroundImage('background', new BackgroundImage('sbbackground.png'));
	this.background_image_map.addBackgroundImage('logo', new BackgroundImage('logo.png'));
	this.background_image_map.addBackgroundImage('gameover', new BackgroundImage('gameover.png'));
};

SwiftyBeams.prototype.initFonts = function() {
	this.game_engine.initFont('Silkscreen', 'slkscr.ttf', 'truetype');
};

SwiftyBeams.prototype.initKeys = function() {
	this.game_engine.key_handler.registerKey('LEFT_ARROW', 37, true);
	this.game_engine.key_handler.registerKey('RIGHT_ARROW', 39, true);
	this.game_engine.key_handler.registerKey('RUN', 90, false);

	this.game_engine.key_handler.registerKey('VOLUME_UP', 187, false);
	this.game_engine.key_handler.registerKey('VOLUME_DOWN', 189, false);
};

SwiftyBeams.prototype.initSounds = function() {
	this.sound_map.addSound('died', new Sound('died.wav'));
	this.sound_map.addSound('laser', new Sound('laser.wav'));
	this.sound_map.addSound('score', new Sound('score.wav'));
};

SwiftyBeams.prototype.showVolume = function() {
	this.ui_container.showVolume();
};

