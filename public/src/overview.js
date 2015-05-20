


$(function() {
  var el  = document.getElementById("overview-canvas"),
      $el = $(el);

  targetImg = document.getElementById("overview-image");

  var arrowDfn = [
    // left
    {
      start: [10, 65], // in percent
      end: [28, 65], // in percent
      bend:  4 // this number controls the bend of the arrow, not really sure what its all about
    },
    //upper right
    {
      start: [85, 10], // in percent
      end: [72, 35], // in percent
      bend:  2 // this number controls the bend of the arrow, not really sure what its all about
    },
  //lower right
    {
      start: [88, 60], // in percent
      end: [73, 70], // in percent
      bend:  8 // this number controls the bend of the arrow, not really sure what its all about
    }
  ];

  $el.css("height", $el.width() * .5);

  $(window).on('resize', function() {
    $el.height($el.width() * .5);
    updateBlurbPositions();
  });

  var width  = Math.max($el.width(), 800),
      height = Math.max($el.height(), 400);

  var painting = new CanvasUtil.Painting(el);

  $el.attr("width", width);
  $el.attr("height", height);

  function updateBlurbPositions() {
    for (var i = 0; i < 3; i++) {
      var textEl = document.getElementById("overview-arrow-" + (i + 1));
      var factor;
      switch(i) {
        case 0:
          factor = .18;
          break;
        case 1:
          factor = .45;
          break;
        case 2:
          factor = .21;
          break;
      }
      $(textEl).css('bottom', $el.width() * factor);
    }
  }

  updateBlurbPositions();

  function pHeight(p) {
    return height * p / 100;
  }
  function pWidth(p) {
    return width * p / 100;
  }

  function createArrow(target, start, bend) {
    var middlePoint   = CanvasUtil.Point.movePointByAngle(start, CanvasUtil.Point.distance(start, target)/2, CanvasUtil.Point.angleBetweenPoints(start, target))
        controlPoint  = CanvasUtil.Point.rotatePointAboutPoint(middlePoint, start, bend),
        a             = new CanvasUtil.Arrow(new CanvasUtil.Point(start.x, start.y), controlPoint, new CanvasUtil.Point(target.x, target.y)),
        factor        = (Math.random() * 5) + 10;

    a.body.width = function(t) {
      return (-factor*(Math.pow(t, 2))) + (factor * t) + 2;
    };
    a.arrow.width = function(t) {
      return (t * 3) + 2;
    };
    return a;
  }

  for (var i = 0, len = arrowDfn.length, arrow; i < len; i++) {

    (function(i) {
      setTimeout(function() {
        arrow = arrowDfn[i];
        painting.add(
          createArrow(
            new CanvasUtil.Point(pWidth(arrow.end[0]), pHeight(arrow.end[1])),
            new CanvasUtil.Point(pWidth(arrow.start[0]), pHeight(arrow.start[1])),
            arrow.bend
          )
        );

        $("#overview-arrow-" + (i + 1)).fadeIn()


      }, i * 500);

    })(i);    
  }


  painting.start();

});