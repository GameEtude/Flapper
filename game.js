"use strict";

var game = new Phaser.Game(2000, 2000, Phaser.CANVAS, '', { preload: preload, create: create, render: render, update: update});
var rectangle, ellipse;
var paddle = {};
var worldMaterial;

function preload() {
  game.load.image('rectangle', 'assets/rectangle.png');
  game.load.image('ellipse', 'assets/ellipse.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.defaultRestitution = 1;

  ellipse =  game.add.sprite(300, 300, 'ellipse');

  game.physics.p2.enable(ellipse, true);

  ellipse.body.setCircle(50);

  game.input.onDown.add(addVelocity, this);

  paddle = createChain(1000, 1000, 3);

  paddle.left.material = game.physics.p2.createMaterial('leftMaterial', paddle.left.body);
  paddle.right.material = game.physics.p2.createMaterial('rightMaterial', paddle.right.body);
  worldMaterial = game.physics.p2.createMaterial('worldMaterial');

  paddle.left.contactMaterial = game.physics.p2.createContactMaterial(paddle.left.material, worldMaterial);
  paddle.right.contactMaterial = game.physics.p2.createContactMaterial(paddle.right.material, worldMaterial);
}

function render() {
}

function update() {
  //sprite.body.velocity.x = 0;
  //sprite.body.velocity.y = 0;
  var left = paddle.left;
  var right = paddle.right;
  var center = paddle.center;
  //left.body.angularVelocity = 0;
  //right.body.angularVelocity = 0;
  center.body.velocity.x = center.body.velocity.x/1.2;
  center.body.velocity.y = center.body.velocity.y/1.2;

  var amount = 10;

  //    left.body.velocity.x = left.body.velocity.x/1.2;
  //    left.body.velocity.y = left.body.velocity.y/1.2;
  //    right.body.velocity.x = right.body.velocity.x/1.2;
  //    right.body.velocity.y = right.body.velocity.y/1.2;
  //paddle.left.contactMaterial.friction = 0.3;
 // paddle.right.contactMaterial.friction = 0.3;

  if (game.input.keyboard.isDown(Phaser.Keyboard.A))
  {
      left.body.angularVelocity = -amount;
      right.body.angularVelocity = amount;

      center.body.velocity.x = Math.cos((center.body.angle-90)/180*Math.PI) * -10;
      center.body.velocity.y = Math.sin((center.body.angle-90)/180*Math.PI) * -10;
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.D))
  {
      left.body.angularVelocity = amount;
      right.body.angularVelocity = -amount;
      center.body.velocity.x = Math.cos((center.body.angle-90)/180*Math.PI) * 200;
      center.body.velocity.y = Math.sin((center.body.angle-90)/180*Math.PI) * 200;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
  {
      center.body.angularVelocity = -amount;
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
  {
      center.body.angularVelocity = amount;
  }
}

function addVelocity() {
  ellipse.body.velocity.x += random(300);
  ellipse.body.velocity.y += random(300);
}

function random(scale) {
  return (Math.random() - 0.5) * scale;
}

function createChain(xAnchor, yAnchor, length) {
  var newRect, firstRect, lastRect, centerRect;
  var width = 100;         //  This is the width for the physics body. If too small the rectangles will get scrambled together.
  var height = 20;        //  Height for the physics body - your image height is 8px
  var maxForce = 20000;   //  The force that holds the rectangles together.

  for (var i = 0; i < length; i++)
  {
    var x = xAnchor + (i * width);                    //  All rects are on the same x position
    var y = yAnchor;     //  Every new rect is positioned below the last

    newRect = game.add.sprite(x, y, 'rectangle');
    console.log(newRect);

    //  Enable physicsbody
    game.physics.p2.enable(newRect, true);

    //  Set custom rectangle
    newRect.body.setRectangle(width, height);

    //newRect.body.velocity.x = 400;      //  Give it a push :) just for fun
    newRect.body.angularVelocity = -200;
    newRect.body.mass = 10;     //  Reduce mass for evey rope element

    //  After the first rectangle is created we can add the constraint
    if (lastRect)
    {
      game.physics.p2.createRevoluteConstraint(newRect, [-width/2 - 10, 0], lastRect, [width/2, 0], maxForce);
    }

    if (i === 0)
    {
      firstRect = newRect;
    }

    if (i === 1)
    {
      centerRect = newRect;
      newRect.body.mass = 10;
    }

    lastRect = newRect;
  }
  return {left: firstRect, right: lastRect, center: centerRect};
}
