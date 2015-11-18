
/**
 * Module dependencies.
 */

var Base = require('mocha').reporters.Base;
var cursor = Base.cursor,
    color = Base.color;

/**
 * Expose 'Bow'.
 */
exports = module.exports = BowDog;

/**
 * Initialize a new 'Bow' reporter.
 *
 * @param {Runner} runner
 * @api public
 */
function BowDog(runner) {
  Base.call(this, runner);
  
  var self = this;
  var width = Base.window.width * .75 | 0;
  var bowDogWidth = this.bowDogWidth = 11;
  
  this.colorIndex = 0;
  this.numberOfLines = 4;
  this.rainbowColors = self.generateColors();
  this.scoreboardWidth = 5;
  this.tick = 0;
  this.trajectories = [[], [], [], []];
  this.trajectoryWidthMax = (width - bowDogWidth);

  runner.on('start', function() {
    Base.cursor.hide();
    self.draw();
  });

  runner.on('pending', function() {
    self.draw();
  });

  runner.on('pass', function() {
    self.draw();
  });

  runner.on('fail', function() {
    self.draw();
  });

  runner.on('end', function() {
    Base.cursor.show();
    for (var i = 0; i < self.numberOfLines; i++) {
      write('\n');
    }
    self.epilogue();
  });
}

/**
 * Draw the bow dog
 *
 * @api private
 */
BowDog.prototype.draw = function() {
  this.appendRainbow();
  this.drawScoreboard();
  this.drawRainbow();
  this.drawBowDog();
  this.tick = !this.tick;
};

/**
 * Draw the "scoreboard" showing the number
 * of passed, failures and pending tests.
 *
 * @api private
 */
BowDog.prototype.drawScoreboard = function() {
  var stats = this.stats;

  function draw(type, n) {
    write(' ');
    write(Base.color(type, n));
    write('\n');
  }

  draw('green', stats.passes);
  draw('fail', stats.failures);
  draw('pending', stats.pending);
  write('\n');

  this.cursorUp(this.numberOfLines);
};

/**
 * Append the rainbow.
 *
 * @api private
 */

BowDog.prototype.appendRainbow = function() {
  var segment = this.tick ? '_' : '-';
  var rainbowified = this.rainbowify(segment);

  for (var index = 0; index < this.numberOfLines; index++) {
    var trajectory = this.trajectories[index];
    if (trajectory.length >= this.trajectoryWidthMax) {
      trajectory.shift();
    }
    trajectory.push(rainbowified);
  }
};

/**
 * Draw the rainbow
 *
 * @api private
 */
BowDog.prototype.drawRainbow = function() {
  var self = this;

  this.trajectories.forEach(function(line) {
    write('\u001b[' + self.scoreboardWidth + 'C');
    write(line.join(''));
    write('\n');
  });
  this.cursorUp(this.numberOfLines);
};

/**
 * Draw the Bow dog
 *
 * @api private
 */
BowDog.prototype.drawBowDog = function() {
  var self = this;
  var startWidth = this.scoreboardWidth + this.trajectories[0].length;
  var dist = '\u001b[' + startWidth + 'C';
  var padding = '';

  write(dist);
  padding = self.tick ? '  ' : '   ';
  write('   ' + padding + '/)_/)');
  write('\n');

  write(dist);
  padding = self.tick ? '    ' : '     ';
  write(padding + this.face() + ' ');
  write('\n');

  write(dist);
  write('  ' + 'ﾉ) /　　|');
  write('\n');

  write(dist);
  padding = self.tick ? ' ' : '  ';
  write(padding + '＼(＿＿_)');
  write('\n');

  this.cursorUp(this.numberOfLines);
}

/**
 * Draw bow dog face.
 *
 * @api private
 * @return {string}
 */
BowDog.prototype.face = function() {
  var stats = this.stats;
  if (stats.failures) {
    return '< x .x>';
  } else if (stats.pending) {
    return '< o .o>';
  } else if (stats.passes) {
    return '< ^ .^>';
  }
  return '< - .->';
};

/**
 * Move cusor up `n`.
 *
 * @api private
 * @param {number} n
 */
BowDog.prototype.cursorUp = function(n) {
  write('\u001b[' + n + 'A');
};

/**
 * Move cursor down `n`.
 *
 * @api private
 * @param {number} n
 */
BowDog.prototype.cursorDown = function(n) {
  write('\u001b[' + n + 'B');
};

/**
 * Generate rainbow colors.
 *
 * @api private
 * @return {Array}
 */
BowDog.prototype.generateColors = function() {
  var colors = [];

  for (var i = 0; i < (6 * 7); i++) {
    var pi3 = Math.floor(Math.PI / 3);
    var n = (i * (1.0 / 6));
    var r = Math.floor(3 * Math.sin(n) + 3);
    var g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
    var b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);
    colors.push(36 * r + 6 * g + b + 16);
  }

  return colors;
};

/**
 * Apply rainbow to the given `str`.
 *
 * @api private
 * @param {string} str
 * @return {string}
 */
BowDog.prototype.rainbowify = function(str) {
  if (!Base.useColors) {
    return str;
  }
  var color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];
  this.colorIndex += 1;
  return '\u001b[38;5;' + color + 'm' + str + '\u001b[0m';
};

/**
 * Stdout helper
 *
 * @param {string} string A message to write to stdout.
 */
function write(string) {
  process.stdout.write(string);
}

BowDog.prototype.__proto__ = Base.prototype;
