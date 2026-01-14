/**
 * Smooth scroll utility function
 * Provides smooth scrolling animation with easing
 */
export function smoothScrollTo(targetY: number, duration = 800): void {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    
    window.scrollTo(0, startY + distance * ease);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

/**
 * Scroll to an element by ID with header offset
 */
export function scrollToElement(id: string, headerHeight = 60): void {
  if (id === 'hero') {
    smoothScrollTo(0, 800);
    return;
  }

  const element = document.getElementById(id);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight;
    smoothScrollTo(offsetPosition, 800);
  }
}
