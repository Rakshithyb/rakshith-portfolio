import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  flipPhase: number;
  flipSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmp: number;
  opacity: number;
  maxOpacity: number;
  life: number;
  maxLife: number;
  type: number; // 0, 1, or 2 for organic variations
  r: number;
  g: number;
  b: number;
}

export const CursorPetals: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // 1. Accessibility & Device Detection
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isTouchOnly =
      window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches;
    if (isTouchOnly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number | null = null;
    let dpr = window.devicePixelRatio || 1;

    // Viewport dimensions
    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Petal storage
    const petals: Petal[] = [];
    const MAX_PETALS = 38;

    // Mouse tracking
    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;
    let lastSpawnX = -100;
    let lastSpawnY = -100;
    let isMouseMoving = false;
    let mouseStopTimer: number | null = null;

    // Color adaptation states
    // Target RGB: Black (15, 15, 15) for light surfaces, White (255, 255, 255) for dark surfaces
    let targetR = 15;
    let targetG = 15;
    let targetB = 15;
    let currentR = 15;
    let currentG = 15;
    let currentB = 15;

    // Helper: Parse RGBA / RGB string from getComputedStyle
    const parseRgba = (colorStr: string): { r: number; g: number; b: number; a: number } | null => {
      if (!colorStr || colorStr === 'transparent') return null;
      const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!match) return null;
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: match[4] !== undefined ? parseFloat(match[4]) : 1,
      };
    };

    // Helper: Detect underlying surface brightness at (x, y)
    let lastCheckTime = 0;
    const updateSurfaceColor = (x: number, y: number) => {
      const now = performance.now();
      // Throttle DOM inspection to at most every 40ms (~25Hz) to keep mousemove at 120fps
      if (now - lastCheckTime < 40) return;
      lastCheckTime = now;

      try {
        const el = document.elementFromPoint(x, y);
        if (!el) return;

        // Traverse ancestors to find first non-transparent background
        let curr: HTMLElement | null = el as HTMLElement;
        let effectiveColor: { r: number; g: number; b: number; a: number } | null = null;

        while (curr && curr !== document.documentElement) {
          const style = window.getComputedStyle(curr);
          const bg = style.backgroundColor;
          const parsed = parseRgba(bg);
          if (parsed && parsed.a > 0.1) {
            effectiveColor = parsed;
            break;
          }
          curr = curr.parentElement;
        }

        // If body has background
        if (!effectiveColor) {
          const bodyBg = window.getComputedStyle(document.body).backgroundColor;
          effectiveColor = parseRgba(bodyBg) || { r: 255, g: 255, b: 255, a: 1 };
        }

        // Calculate WCAG / HSP perceived brightness: 0 (black) to 255 (white)
        const brightness = (effectiveColor.r * 299 + effectiveColor.g * 587 + effectiveColor.b * 114) / 1000;

        // If background is light (> 135), use pure monochrome black petals (#0F0F0F)
        // If background is dark (<= 135), use pure monochrome white petals (#FFFFFF)
        if (brightness > 135) {
          targetR = 15;
          targetG = 15;
          targetB = 15;
        } else {
          targetR = 255;
          targetG = 255;
          targetB = 255;
        }
      } catch {
        // Fallback default: black on light
        targetR = 15;
        targetG = 15;
        targetB = 15;
      }
    };

    // Spawn a delicate petal
    const spawnPetal = (x: number, y: number, vx: number, vy: number) => {
      if (petals.length >= MAX_PETALS) {
        petals.shift(); // keep bounded
      }

      // Size between 9px and 16px
      const size = 9 + Math.random() * 7;
      // Slight outward spray velocity mixed with mouse motion
      const sprayAngle = Math.random() * Math.PI * 2;
      const spraySpeed = 0.4 + Math.random() * 0.9;

      petals.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: vx * 0.12 + Math.cos(sprayAngle) * spraySpeed,
        vy: vy * 0.12 + Math.sin(sprayAngle) * spraySpeed + 0.35, // gentle natural descent
        size,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 1.6,
        flipPhase: Math.random() * Math.PI * 2,
        flipSpeed: 1.2 + Math.random() * 2.2, // 3D tumbling flutter
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 1.8 + Math.random() * 2.0,
        swayAmp: 0.4 + Math.random() * 0.6,
        opacity: 0.05,
        maxOpacity: 0.48 + Math.random() * 0.24, // refined, restrained editorial opacity
        life: 0,
        maxLife: 55 + Math.random() * 35, // ~0.9 to 1.5 seconds lifespan at 60fps
        type: Math.floor(Math.random() * 3),
        r: currentR,
        g: currentG,
        b: currentB,
      });
    };

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseMoving = true;

      if (mouseStopTimer !== null) {
        window.clearTimeout(mouseStopTimer);
      }
      mouseStopTimer = window.setTimeout(() => {
        isMouseMoving = false;
      }, 140);

      // Inspect surface color under cursor
      updateSurfaceColor(mouseX, mouseY);

      // Check distance moved since last spawn
      const distFromLastSpawn = Math.hypot(mouseX - lastSpawnX, mouseY - lastSpawnY);
      if (distFromLastSpawn > 18) {
        const vx = mouseX - prevMouseX;
        const vy = mouseY - prevMouseY;
        spawnPetal(mouseX, mouseY, vx, vy);
        lastSpawnX = mouseX;
        lastSpawnY = mouseY;
      }

      prevMouseX = mouseX;
      prevMouseY = mouseY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Draw an organic petal silhouette
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // 3D Tumbling flutter projection: scale horizontal axis with cosine
      const flipScale = Math.cos(p.flipPhase);
      ctx.scale(flipScale, 1);

      const w = p.size * 0.48;
      const h = p.size;

      ctx.beginPath();

      if (p.type === 0) {
        // Type 0: Classic slender teardrop petal
        ctx.moveTo(0, -h * 0.55);
        ctx.bezierCurveTo(w * 0.85, -h * 0.35, w * 0.7, h * 0.35, 0, h * 0.55);
        ctx.bezierCurveTo(-w * 0.7, h * 0.35, -w * 0.85, -h * 0.35, 0, -h * 0.55);
      } else if (p.type === 1) {
        // Type 1: Rounded blossom petal with gentle organic asymmetry
        ctx.moveTo(0, -h * 0.5);
        ctx.bezierCurveTo(w * 0.95, -h * 0.25, w * 0.85, h * 0.45, 0, h * 0.5);
        ctx.bezierCurveTo(-w * 0.65, h * 0.45, -w * 0.85, -h * 0.2, 0, -h * 0.5);
      } else {
        // Type 2: Curving, drifting petal with subtle tip notch
        ctx.moveTo(w * 0.1, -h * 0.55);
        ctx.bezierCurveTo(w * 0.9, -h * 0.2, w * 0.5, h * 0.4, 0, h * 0.52);
        ctx.bezierCurveTo(-w * 0.6, h * 0.35, -w * 0.75, -h * 0.3, w * 0.1, -h * 0.55);
      }

      ctx.closePath();

      // Main petal fill with smooth adapted color & life fade
      ctx.fillStyle = `rgba(${Math.round(p.r)}, ${Math.round(p.g)}, ${Math.round(p.b)}, ${p.opacity.toFixed(3)})`;
      ctx.fill();

      // Delicate organic spine / vein stroke for editorial realism
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.35);
      ctx.quadraticCurveTo(w * 0.1, 0, 0, h * 0.35);
      ctx.strokeStyle = `rgba(${Math.round(p.r)}, ${Math.round(p.g)}, ${Math.round(p.b)}, ${(p.opacity * 0.4).toFixed(3)})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      ctx.restore();
    };

    // Main 60fps/120fps Animation Loop
    let lastFrameTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastFrameTime) / 1000, 0.033);
      lastFrameTime = time;

      // Smooth color transition towards target (smooth blend when crossing light/dark boundaries)
      currentR += (targetR - currentR) * 0.14;
      currentG += (targetG - currentG) * 0.14;
      currentB += (targetB - currentB) * 0.14;

      // Clear previous canvas frame
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Update and render active petals
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.life += 1;

        // Life progression (0.0 to 1.0)
        const progress = p.life / p.maxLife;

        // Smooth fade-in then gentle graceful fade-out
        if (progress < 0.15) {
          p.opacity = (progress / 0.15) * p.maxOpacity;
        } else {
          // Quadratic ease-out fade
          const fadeProgress = (progress - 0.15) / 0.85;
          p.opacity = p.maxOpacity * (1 - fadeProgress * fadeProgress);
        }

        // Color smooth transition of floating petal towards current adapted surface tone
        p.r += (currentR - p.r) * 0.1;
        p.g += (currentG - p.g) * 0.1;
        p.b += (currentB - p.b) * 0.1;

        // Physics: air drag & gentle gravity descent
        p.vx *= 0.965;
        p.vy = p.vy * 0.97 + 0.18 * dt * 60; // gentle descent drift

        // Horizontal atmospheric sway
        p.swayPhase += p.swaySpeed * dt;
        const swayX = Math.sin(p.swayPhase) * p.swayAmp;

        p.x += (p.vx + swayX) * dt * 60;
        p.y += p.vy * dt * 60;

        // Rotation & 3D flutter
        p.rotation += p.rotSpeed * dt;
        p.flipPhase += p.flipSpeed * dt;

        // Draw petal if within lifetime
        if (p.life < p.maxLife && p.opacity > 0.005) {
          drawPetal(p);
        } else {
          petals.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    // Cleanup all listeners and loops on unmount
    return () => {
      if (animId !== null) cancelAnimationFrame(animId);
      if (mouseStopTimer !== null) clearTimeout(mouseStopTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      style={{
        width: '100vw',
        height: '100vh',
      }}
      aria-hidden="true"
    />
  );
};
