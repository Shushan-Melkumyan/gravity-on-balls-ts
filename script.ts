interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface Circle {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: number;
  gradientColors: string[];
  bounceFactor: number;
  airResistance: number;
  gravity: number;

  draw(): void;
  update(): void;
}

const canvas: HTMLCanvasElement = document.getElementById("gravityCanvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const circles: Circle[] = [];
const starField: Star[] = [];

for (let i = 0; i < 100; i++) {
  const x: number = Math.random() * canvas.width;
  const y: number = Math.random() * canvas.height;
  const size: number = Math.random() * 2;
  const speed: number = Math.random() * 0.5 + 0.1;
  starField.push({ x, y, size, speed });
}

function createCircle(x: number, y: number, radius: number, color: string, velocity: number, gradientColors: string[]): Circle {
  return {
    x,
    y,
    radius,
    color,
    velocity: (Math.random() - 0.5) * 5,
    gradientColors,
    bounceFactor: Math.random() * 0.3 + 0.7,
    airResistance: 0.01 * (1 / radius),
    gravity: 0.2 * (radius / 20),

    draw() {
      const gradient: CanvasGradient = ctx.createRadialGradient(
        this.x - this.radius * 0.3,
        this.y - this.radius * 0.3,
        0,
        this.x,
        this.y,
        this.radius
      );
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

    update() {
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

  for (let i = 0; i < starField.length; i++) {
    const star: Star = starField[i];
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

  circles.forEach((circle) => circle.update());
}

canvas.addEventListener("click", (event) => {
  const radius: number = Math.random() * 30 + 10;
  const color: string = getRandomColor();
  const gradientColors: string[] = ["#F28585", color];
  circles.push(createCircle(event.clientX, event.clientY, radius, color, 0, gradientColors));
});

function getRandomColor(): string {
  const predefinedColors: string[] = [
    "#BF0436",
    "#D92525",
    "#F23005",
    "#F29F05",
    "#D93D3D",
    "#04BF8A",
    "#D93D3D",
    "#04BF8A",
  ];
  const randomIndex: number = Math.floor(Math.random() * predefinedColors.length);
  return predefinedColors[randomIndex];
}

animate();
