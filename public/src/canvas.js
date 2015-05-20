define([], function() {

  function Painting(canvas) {
    this.canvas = canvas;
    this.entities = [];
    this.started = false;
    // bind draw to this context;
    var self = this;
    this.draw = function() { return Painting.prototype.draw.apply(self, arguments); }

    if (canvas && canvas.getContext) {
      this.ctx = canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = true;
      if (window.requestAnimationFrame) {
        this.setup();
      }
    }
  }

  Painting.prototype.start = function() {
    if (this.started) { return this; }

    this.started = true;

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this.draw);
    }

    for (var i = 0, len = this.entities.length, entity; i < len; i++) {
      entity = this.entities[i];
      if (entity.start) {
        entity.start();
      }
    }
    
    return this;
  };

  Painting.prototype.stop = function() {
    this.started = false;
    return this;
  };

  Painting.prototype.clear = function() {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    return this;
  };

  Painting.prototype.draw = function() {
    if (this.started === false) { return; }
    var ctx = this.ctx;
    var now = new Date();
    var timeElapsed = this._lastUpdate ? now - this._lastUpdate : 0;

    this.clear();    


    // Update all game objects internal state
    for (var i = 0, len = this.entities.length, child; i < len; i++) {
      child = this.entities[i];
      child.update(timeElapsed);
    }

    // Draw all game objects
    for (var i = 0, len = this.entities.length, child; i < len; i++) {
      child = this.entities[i];
      child.draw();
    }

    ctx.restore();
    this._lastUpdate = now;
    window.requestAnimationFrame(this.draw);
  }


  Painting.prototype.setup = function() {

  }


  Painting.prototype.add = function(entity) {
    entity.ctx      = this.ctx;
    entity.canvas   = this.canvas;
    entity.painting = this.painting;
    this.entities.push(entity);
    if (entity.entities) {
      for (var i = 0, len = entity.entities.length, ent; i < len; i++) {
        ent = entity.entities[i];
        this.add(ent);
      }
    }
    if (this.started && typeof entity.start == 'function') {
      entity.start();
    }
    return this;
  }

  Painting.prototype.empty = function() {
    return this.entities.splice(0, this.entities.length);
  };

  var Point = function(x, y) {
    this.x = x;
    this.y = y;
  };

  Point.movePointByAngle = function(point, length, angle) {
    return new Point(point.x - (length * Math.cos(angle)), point.y - (length * Math.sin(angle)));
  };

  Point.rotatePointAboutPoint = function(point1, point2, angle) {
    return new Point(
      point2.x + ((point1.x-point2.x) * Math.cos(angle)) - ((point1.y-point2.y) * Math.sin(angle)),
      point2.y + ((point1.x-point2.x) * Math.sin(angle)) + ((point1.y-point2.y) * Math.cos(angle))
    );
  };

  Point.angleBetweenPoints = function(start, end) {
    return Math.atan2(end.y-start.y, end.x-start.x);
  };

  Point.distance = function(p1,p2) {
    return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
  };

  var Line = function(start, end) {
    this.start = start;
    this.end   = end;
  }

  Line.prototype.getPointAt = function(t) {
    var p0 = this.start,
        p1 = this.end;

    return new Point(
      p0.x + t * (p1.x - p0.x), //x
      p0.y + t * (p1.y - p0.y)  //y
    );
  }

  var Curve = function(start, control, end) {
    this.start   = start;
    this.control = control;
    this.end     = end;
  }

  Curve.prototype.getPointAt = function(t) {
    var p0 = this.start,
        p1 = this.control,
        p2 = this.end;

    return new Point(
      (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x, //x
      (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y  //y
    );
  }

  function getProperty(value, t) {
    if (typeof value === "function") {
      return value(t)
    } else {
      return value;
    }
  }

  var Stroke = function(path) {
    this.path        = path;
    this.width       = 10;
    this.completion  = 0;
    this.speed       = .004;
    this.animating   = false;
    this.step        = .002;
    this.density     = 1.5;
    this.color       = 'white';
    this.brush       = drawBrush;
  }



  Stroke.prototype.update = function(ms) {
    if (this.animating) {
      if (this.completion < 1) {
        this.completion += this.speed * ms;
        if (this.completion > 1) {
          this.completion = 1;
        }
      } else {
        this.animating = false;
      }
    }
  };


  Stroke.prototype.draw = function() {

    var t = 0;

    var lastPoint = null;
    while (t < this.completion) {
      var curvePt        = this.path.getPointAt(t),
          _width         = getProperty(this.width, t);

      if (lastPoint && Point.distance(curvePt, lastPoint) < (_width/(2*this.density))) {
        t += this.step/2;
      } else {
        this.brush(this.ctx, curvePt, _width, this.color);

        t += this.step;
        lastPoint = curvePt;
      }
    }
    //always draw the end!
    this.brush(this.ctx, this.path.getPointAt(this.completion), _width, this.color);

  };

  function drawBrush(ctx, point, size, color) {
    ctx.beginPath();
    // ctx.rect(point.x - size/2 -0.5, point.y - size/4-0.5, size, size/2);
    ctx.arc(point.x, point.y, size/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  var Arrow = function(start, control, end) {
    var arrowControlLength = 100;
    var arrowPadding       = 20;
    this.headLength        = 30;
    this.headAngle         = 90;
    this.width             = 5;
    this.entities          = [];

    var headAngle = Point.angleBetweenPoints(control, end);

    var arrowControlPoint = Point.movePointByAngle(end, -arrowControlLength, headAngle);
    var headDistancePoint = Point.movePointByAngle(end, this.headLength, headAngle);
    var rightHeadPoint    = Point.rotatePointAboutPoint(headDistancePoint, end, this.headAngle/2);
    var leftHeadPoint     = Point.rotatePointAboutPoint(headDistancePoint, end, -this.headAngle/2);
    
    // build the arrow path so we can find out how much the curve puts
    // itself over our target end point
    var arrowPath        = new Curve(leftHeadPoint, arrowControlPoint, rightHeadPoint);

    // get the middle of the arrow curve so we know the bounds of our point

    // find how far off the arrowPath is from the target
    var delta = Point.distance(arrowPath.getPointAt(0.5), end);

    leftHeadPoint     = Point.movePointByAngle(leftHeadPoint, delta, headAngle);
    rightHeadPoint    = Point.movePointByAngle(rightHeadPoint, delta, headAngle);
    arrowControlPoint = Point.movePointByAngle(arrowControlPoint, delta, headAngle);

    arrowPath     = new Curve(leftHeadPoint, arrowControlPoint, rightHeadPoint);

    var bodyEndPoint = Point.movePointByAngle(arrowPath.getPointAt(0.5), arrowPadding, headAngle);

    this.body  = this.add(new Stroke(new Curve(start, control, bodyEndPoint)));
    this.arrow = this.add(new Stroke(arrowPath));
  };

  Arrow.prototype.add = function(entity) {
    this.entities.push(entity);
    return entity;
  }

  Arrow.prototype.update = function(ms) {
    this.body.update(ms);
    this.arrow.update(ms);
    if (this.started) {
      if (!this.body.animating && this.started == 1) {
          this.arrow.animating = true;
          this.started = 2;
      }
      if (!this.body.animating && this.started == 2) {
        this.started = 3;
      }
    }
  }

  Arrow.prototype.draw = function() {
    this.body.draw();
    this.arrow.draw();
  }

  Arrow.prototype.start = function() {
    this.body.speed = this.body.speed/2;
    this.body.animating = true;
    this.started = 1;
  }

  return {
    Painting : Painting,
    Point    : Point,
    Line     : Line,
    Curve    : Curve,
    Stroke   : Stroke,
    Arrow    : Arrow
  }
});