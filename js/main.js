// One of my first <canvas> experiments, woop! :D 

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var SPD_SCALE = 1;
var SPD_SCALE_MAX = 2.2;
var SPD_SCALE_MIN = 0.69;
var RADIUS = 69;

var RADIUS_SCALE = 1;
var RADIUS_SCALE_MIN = 0.69;
var RADIUS_SCALE_MAX = 6.9;

var QUANTITY = 69;

var canvas;
var context;
var particles;

var mouseX = SCREEN_WIDTH * 0.5;
var mouseY = SCREEN_HEIGHT * 0.5;
var mouseIsDown = false;

function init() {

   // One Page Scroll
onePageScroll(".main", {
   sectionContainer: "section",     // sectionContainer accepts any kind of selector in case you don't want to use section
   easing: "ease",                  // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in", 
                                    // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
   animationTime: 1000,             // AnimationTime let you define how long each section takes to animate
   pagination: true,                // You can either show or hide the pagination. Toggle true for show, false for hide.
   updateURL: false,                // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
   beforeMove: function(index) {},  // This option accepts a callback function. The function will be called before the page moves.
   afterMove: function(index) {},   // This option accepts a callback function. The function will be called after the page moves.
   loop: false,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
   keyboard: true,                  // You can activate the keyboard controls
   responsiveFallback: false        // You can fallback to normal page scroll by defining the width of the browser in which
                                    // you want the responsive fallback to be triggered. For example, set this to 600 and whenever 
                                    // the browser's width is less than 600, the fallback will kick in.
});

  canvas = document.getElementById( 'cnvs' );
  
  if (canvas && canvas.getContext) {
      context = canvas.getContext('2d');
      
      // Register event listeners
      window.addEventListener('mousemove', documentMouseMoveHandler, false);
      window.addEventListener('mousedown', documentMouseDownHandler, false);
      window.addEventListener('mouseup', documentMouseUpHandler, false);
      document.addEventListener('touchstart', documentTouchStartHandler, false);
      document.addEventListener('touchmove', documentTouchMoveHandler, false);
      window.addEventListener('resize', windowResizeHandler, false);
      
      createParticles();
      
      windowResizeHandler();
      
      setInterval( loop, 1000 / 60 );
   }

   /*todo pic expand*/
   document.getElementById("z").onclick = function(){loadImage()};
}

function loadImage() {
   alert("Z");
}

function createParticles() {
   particles = [];
   
   for (var i = 0; i < QUANTITY; i++) {
      var particle = {
         size: 7,
         position: { x: mouseX, y: mouseY },
         offset: { x: 0, y: 0 },
         shift: { x: mouseX, y: mouseY },
         speed: 0.01 + Math.random()*0.04,
         targetSize: 7,
         fillColor: '#' + (Math.random() * 0x000222 + 0xcccccc | 0).toString(16),
         orbit: RADIUS*.5 + (RADIUS * .5 * Math.random())
      };
      
      particles.push( particle );
   }
}

function documentMouseMoveHandler(event) {
   mouseX = event.clientX - (window.innerWidth - SCREEN_WIDTH) * .5;
   mouseY = event.clientY - (window.innerHeight - SCREEN_HEIGHT) * .5;
}

function documentMouseDownHandler(event) {
   mouseIsDown = true;
}

function documentMouseUpHandler(event) {
   mouseIsDown = false;
}

function documentTouchStartHandler(event) {
   if(event.touches.length == 1) {
      event.preventDefault();

      mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * .5;;
      mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * .5;
   }
}

function documentTouchMoveHandler(event) {
   if(event.touches.length == 1) {
      event.preventDefault();

      mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * .5;;
      mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * .5;
   }
}

function windowResizeHandler() {
   SCREEN_WIDTH = window.innerWidth;
   SCREEN_HEIGHT = window.innerHeight;
   
   canvas.width = SCREEN_WIDTH;
   canvas.height = SCREEN_HEIGHT;
}

function loop() {
   
   if( mouseIsDown ) {
      RADIUS_SCALE += ( RADIUS_SCALE_MAX - RADIUS_SCALE ) * (0.01);
      SPD_SCALE += (SPD_SCALE_MAX - SPD_SCALE) * (0.01);
   }
   else {
      RADIUS_SCALE -= ( RADIUS_SCALE - RADIUS_SCALE_MIN ) * (0.02);
      SPD_SCALE -= (SPD_SCALE - SPD_SCALE_MIN) * (0.02);
   }
   
   RADIUS_SCALE = Math.min( RADIUS_SCALE, RADIUS_SCALE_MAX );
   
   context.fillStyle = 'rgba(23,32,42, 0.77)';
   context.fillRect(0, 0, context.canvas.width, context.canvas.height);
   
   for (i = 0, len = particles.length; i < len; i++) {
      var particle = particles[i];
      
      var lp = { x: particle.position.x, y: particle.position.y };

      // Rotation
      particle.offset.x += particle.speed * SPD_SCALE;
      particle.offset.y += particle.speed * SPD_SCALE;
      
      // Follow mouse with some lag
      particle.shift.x += ( mouseX - particle.shift.x) * (particle.speed * 2);
      particle.shift.y += ( mouseY - particle.shift.y) * (particle.speed * 2);
      
      // Apply position
      particle.position.x = particle.shift.x + Math.cos(i + particle.offset.x) * (particle.orbit*RADIUS_SCALE);
      particle.position.y = particle.shift.y + Math.sin(i + particle.offset.y) * (particle.orbit*RADIUS_SCALE);
      
      // Limit to screen bounds
      particle.position.x = Math.max( Math.min( particle.position.x, SCREEN_WIDTH ), 0 );
      particle.position.y = Math.max( Math.min( particle.position.y, SCREEN_HEIGHT ), 0 );
      
      particle.size += ( particle.targetSize - particle.size ) * 0.02;
      
      if( Math.round( particle.size ) == Math.round( particle.targetSize ) ) {
         particle.targetSize = 7 + Math.random() * 13;
      }
      
      context.beginPath();
      context.fillStyle = particle.fillColor;
      context.strokeStyle = particle.fillColor;
      context.lineWidth = particle.size;
      context.moveTo(lp.x, lp.y);
      //context.lineTo(particle.position.x, particle.position.y);
      context.stroke();
      context.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
      context.fill();
   }
}

window.onload = init;