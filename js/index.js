/**
 * Generated from the Phaser Sandbox
 *
 * //phaser.io/sandbox/hQXmCTYf
 *
 * This source requires Phaser 2.6.2
 */

var game = new Phaser.Game(320, 480, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

  game.load.baseURL = '';
  game.load.crossOrigin = 'anonymous';

  game.load.image('heart', 'img/heart.png');
  game.load.spritesheet('met', 'img/mettaur.png', 256, 256, 9);

}

var emitter;
var mettaur;
var idle;
var blush;
var happy;

var textTitle;
var textKiss;
var textPet;
var countKiss = 0;
var countPet = 0;

var pendingTimer = 0;

function create() {

  // Set up BG
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = 0x337799;

  // Add second touch finger
  game.input.addPointer();

  // Create Met
  mettaur = game.add.sprite(160, 240, 'met');
  mettaur.anchor.set(0.5);
  mettaur.inputEnabled = true;
  mettaur.input.useHandCursor = true;

  idle = mettaur.animations.add('idle', [0, 1, 2], 6, true);
  blush = mettaur.animations.add('blush', [3, 4, 5], 6, false);
  happy = mettaur.animations.add('happy', [6, 7, 8], 6, false);

  blush.onComplete.add(playIdle, this);
  happy.onComplete.add(playIdle, this);

  playIdle();

  // Create Emitter
  emitter = game.add.emitter(0, 0, 100);

  emitter.makeParticles('heart');
  emitter.gravity = -32;
  emitter.setAlpha(0, 1, 1200, null, true);
  emitter.setScale(0.1, 1, 0.1, 1, 1200, Phaser.Easing.Quintic.Out);

  // Start emitter when touch mettaur
  mettaur.events.onInputDown.add(particleBurst, this);

  // Text
  textTitle = game.add.text(42, 16, '// Met Smoocher //', { fill: '#ffffff' });
  textKiss = game.add.text(10, 400, 'Kisses: 0', { fill: '#ffffff' });
  textPet = game.add.text(10, 440, 'Pets: 0', { fill: '#ffffff' });
}

function playIdle() {
  mettaur.animations.play('idle');
  state = 'idle';
}

function particleBurst(pointer) {
  //  Position the emitter where the mouse/touch event was
  emitter.x = pointer.x;
  emitter.y = pointer.y;

  //  The first parameter sets the effect to "explode" which means all particles are emitted at once
  //  The second gives each particle a 2000ms lifespan
  //  The third is ignored when using burst/explode mode
  //  The final parameter (10) is how many particles will be emitted in this single burst

  if (mettaur.input.pointerDown(1) && mettaur.input.pointerDown(2)) { // process kiss
    emitter.start(true, 3000, null, 16);
    mettaur.animations.play('blush');
    state = 'blush';
    countKiss++;
    textKiss.text = "Kisses: " + countKiss;
    pendingTimer = 0;
  } else if (state == 'idle' && mettaur.input.pointerDown(1) || mettaur.input.pointerDown(2)) { // wait to see if turns into kiss
    state = 'pending';
    pendingTimer = 5;
  } else if (pendingTimer > 0) {
    pendingTimer--;
  } else { // process pet
    emitter.start(true, 1500, null, 1);
    mettaur.animations.play('happy');
    state = 'happy';
    countPet++;
    textPet.text = "Pets: " + countPet;
  }
}

function update() {}

function render() {
  //game.debug.pointer(game.input.mousePointer);
  //game.debug.pointer(game.input.pointer1);
  //game.debug.pointer(game.input.pointer2);
}