<script lang="ts">
  import { onMount } from "svelte";
  import { theme } from "../lib/theme";

  let canvas: HTMLCanvasElement;
  let animationFrame: number;
  let ctx: CanvasRenderingContext2D;
  let time = 0;
  let isDark = true;
  let imageData: ImageData | null = null;

  // Fixed small canvas resolution for performance (scaled via CSS)
  const CANVAS_WIDTH = 360;
  const CANVAS_HEIGHT = 360;

  onMount(() => {
    if (!canvas) return;

    let unsubscribe: (() => void) | null = null;
    let isVisible = !document.hidden;
    
    // Optimized animation loop with frame skipping for better performance
    let lastFrameTime = 0;
    const targetFPS = 15; // Reduced to 15 FPS for better performance
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (!isVisible || !ctx) {
        animationFrame = 0;
        return;
      }
      
      if (currentTime - lastFrameTime >= frameInterval) {
        time += 0.01;
        drawPlasma();
        lastFrameTime = currentTime;
      }
      
      animationFrame = requestAnimationFrame(animate);
    };

    // Pause animation when page is hidden to save resources
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (!isVisible && animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else if (isVisible && !animationFrame && ctx) {
        // Resume animation when page becomes visible
        animationFrame = requestAnimationFrame(animate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Delay initialization to avoid blocking initial page load
    const initPlasma = () => {
      ctx = canvas.getContext("2d", { alpha: true })!;
      if (!ctx) return;

      // Set fixed small canvas resolution for performance
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      
      // Pre-create ImageData to reuse and avoid allocations
      imageData = ctx.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);

      // Subscribe to theme changes
      unsubscribe = theme.subscribe((current) => {
        isDark = current === "dark";
      });

      // Start animation only if visible
      if (isVisible) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    // Use requestIdleCallback if available, otherwise use setTimeout
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(initPlasma, { timeout: 100 });
    } else {
      setTimeout(initPlasma, 100);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (unsubscribe) unsubscribe();
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      // Clear canvas context and free ImageData
      if (ctx) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx = null as any;
      }
      imageData = null;
    };
  });

  function drawPlasma() {
    if (!ctx || !canvas || !imageData) return;

    const width = CANVAS_WIDTH;
    const height = CANVAS_HEIGHT;
    const data = imageData.data;

    // Pre-calculate constants
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const time1 = time;
    const time2 = time * 0.7;
    const time3 = time * 1.3;
    const time4 = time * 0.5;
    const time5 = time * 0.8;
    
    // Pre-calculate sine values for time-based animations
    const sinTime = Math.sin(time);
    const sinTime2 = Math.sin(time * 1.2);
    const sinTime3 = Math.sin(time * 0.8);

    // Optimized plasma calculation
    for (let y = 0; y < height; y++) {
      const yOffset = y * width;
      const dy = y - centerY;
      const dy2 = dy * dy;
      const yTime = y * 0.006 + time2;
      
      for (let x = 0; x < width; x++) {
        const index = (yOffset + x) * 4;
        const dx = x - centerX;

        // Optimized calculations - use distance squared where possible
        const distSq = dx * dx + dy2;
        const dist = Math.sqrt(distSq);
        const angle = Math.atan2(dy, dx);

        // Create multiple sine waves for plasma effect
        // Reduced frequencies for less spread/glow, larger patterns
        const v1 = Math.sin(x * 0.006 + time1);
        const v2 = Math.sin(yTime);
        // Reduce center concentration - use larger distance multiplier to spread middle
        const v3 = Math.sin(dist * 0.008 + time3);
        const v4 = Math.sin((x + y) * 0.008 + time4);
        const v5 = Math.sin(angle * 2 + time5);

        // Combine waves
        const value = (v1 + v2 + v3 + v4 + v5) * 0.2;

        // Color mapping based on theme
        if (isDark) {
          // Dark theme: stronger emerald/cyan plasma
          // Reduced glow - less variation in opacity
          data[index] = Math.floor(20 + value * 25 + sinTime * 8);
          data[index + 1] = Math.floor(30 + value * 40 + sinTime2 * 12);
          data[index + 2] = Math.floor(40 + value * 35 + sinTime3 * 10);
          data[index + 3] = Math.floor(100 + value * 40); // Less opacity variation
        } else {
          // Light theme: green and white only, more white than green
          // White base with subtle green tint - more white than green
          const baseWhite = 240; // High white base
          const greenTint = value * 12; // Subtle green variation
          
          // R and B stay high (white), G gets slight green boost
          data[index] = Math.floor(baseWhite + sinTime * 4);
          data[index + 1] = Math.floor(baseWhite + greenTint + sinTime2 * 6);
          data[index + 2] = Math.floor(baseWhite + sinTime * 4);
          data[index + 3] = Math.floor(130 + value * 50); // Less opacity variation
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }
</script>

<canvas bind:this={canvas} class="plasma-canvas"></canvas>

<style>
  .plasma-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
    opacity: 0.6;
    mix-blend-mode: screen;
    will-change: contents;
    image-rendering: auto;
    /* Smaller canvas scaled up - browser handles scaling efficiently */
  }

  :global(.light) .plasma-canvas {
    opacity: 0.9;
    mix-blend-mode: normal;
  }
</style>
