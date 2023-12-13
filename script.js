var canvas = document.getElementById("gravityCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var circles = [];
var starField = [];
for (var i = 0; i < 100; i++) {
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    var size = Math.random() * 2;
    var speed = Math.random() * 0.5 + 0.1;
    starField.push({ x: x, y: y, size: size, speed: speed });
}
function createCircle(x, y, radius, color, velocity, gradientColors) {
    return {
        x: x,
        y: y,
        radius: radius,
        color: color,
        velocity: (Math.random() - 0.5) * 5,
        gradientColors: gradientColors,
        bounceFactor: Math.random() * 0.3 + 0.7,
        airResistance: 0.01 * (1 / radius),
        gravity: 0.2 * (radius / 20),
        draw: function () {
            var gradient = ctx.createRadialGradient(this.x - this.radius * 0.3, this.y - this.radius * 0.3, 0, this.x, this.y, this.radius);
            gradient.addColorStop(0, this.gradientColors[0]);
            gradient.addColorStop(1, this.gradientColors[1]);
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
            ctx.shadowOffsetX = this.radius / 8;
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        },
        update: function () {
            this.draw();
            this.velocity *= 1 - this.airResistance;
            this.velocity += this.gravity;
            this.y += this.velocity;
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.x *= -1;
            }
            if (this.y + this.radius > canvas.height) {
                this.y = canvas.height - this.radius;
                this.velocity = -this.velocity * this.bounceFactor;
            }
        },
    };
}
function drawStars() {
    ctx.fillStyle = "white";
    for (var i = 0; i < starField.length; i++) {
        var star = starField[i];
        ctx.fillRect(star.x, star.y, star.size, star.size);
        if (i % 10 === 0) {
            star.x += star.speed;
            if (star.x > canvas.width) {
                star.x = 0;
            }
        }
    }
}
function animate() {
    requestAnimationFrame(animate);
    (ctx.fillStyle = "#000033"), ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStars();
    circles.forEach(function (circle) { return circle.update(); });
}
canvas.addEventListener("click", function (event) {
    var radius = Math.random() * 30 + 10;
    var color = getRandomColor();
    var gradientColors = ["#F28585", color];
    circles.push(createCircle(event.clientX, event.clientY, radius, color, 0, gradientColors));
});
function getRandomColor() {
    var predefinedColors = [
        "#BF0436",
        "#D92525",
        "#F23005",
        "#F29F05",
        "#D93D3D",
        "#04BF8A",
        "#D93D3D",
        "#04BF8A",
    ];
    var randomIndex = Math.floor(Math.random() * predefinedColors.length);
    return predefinedColors[randomIndex];
}
animate();
