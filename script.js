var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 350 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var wolf;
var tps;
var sheeps;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var treeTP;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/forestBG.png');
    this.load.image('star', 'assets/tp.png');
    this.load.image('sheep', 'assets/sheep.png');
    this.load.spritesheet('dude', 'assets/wolfsprite.png', { frameWidth: 30, frameHeight: 30 });
    this.load.image('grass', 'assets/ground.png'),
    this.load.image('treeBranch1', 'assets/treebranch1.png'),
    this.load.image('treeBranch2', 'assets/treebranch2.png'),
    this.load.image('treeBranch3', 'assets/treebranch3.png');
    this.load.image('treeBranch4', 'assets/treebranch4.png');
}

function create ()
{
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    treeTP = this.physics.add.staticGroup();
    
    platforms.create(400, 588, 'grass').refreshBody();
    platforms.create(190, 330, 'treeBranch1');
    platforms.create(640, 330, 'treeBranch2');
    platforms.create(252, 500, 'treeBranch3');
    platforms.create(330, 460, 'treeBranch3');
    platforms.create(360, 520, 'treeBranch3');
    treeTP.create(80, 210, 'treeBranch4');
    treeTP.create(150, 270, 'treeBranch4');
    treeTP.create(650, 160, 'treeBranch4');
    treeTP.create(700, 220, 'treeBranch4');

    wolf = this.physics.add.sprite(300, 450, 'dude');
    wolf.setBounce(0.2);
    wolf.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 2, end: 2 }),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 0 } ],
        frameRate: 1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 1, end: 1 }),
        frameRate: 1,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    tps = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    tps.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    sheeps = this.physics.add.group();

    scoreText = this.add.text(16, 16, 'TP Rolls: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(wolf, platforms);
    this.physics.add.collider(tps, platforms);
    this.physics.add.collider(sheeps, platforms);
    this.physics.add.collider(tps, treeTP);
    this.physics.add.overlap(wolf, tps, collectStar, null, this);
    this.physics.add.collider(wolf, sheeps, hitSheep, null, this);
}

function update ()
{
    if (gameOver)
    {
        return;
    }
    if (cursors.left.isDown)
    {
        wolf.setVelocityX(-160);

        wolf.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        wolf.setVelocityX(160);

        wolf.anims.play('right', true);
    }
    else
    {
        wolf.setVelocityX(0);

        wolf.anims.play('turn');
    }
    if (cursors.up.isDown && wolf.body.touching.down)
    {
        wolf.setVelocityY(-330);
    }
}

function collectStar (wolf, star)
{
    star.disableBody(true, true);
    score += 1;
    scoreText.setText('TP Rolls: ' + score);

    if (tps.countActive(true) === 0)
    {
      tps.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x = (wolf.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      var sheep = sheeps.create(x, 16, 'sheep');

      sheep.setBounce(1);
      sheep.setCollideWorldBounds(true);
      sheep.setVelocity(Phaser.Math.Between(-200, 200), 20);
      sheep.allowGravity = false;

    }
}

function hitSheep (wolf, sheep)
{
  this.physics.pause();
  wolf.setTint(0xff0000);
  wolf.anims.play('turn');
  gameOver = true;
}
