import {
  INVIEW_THRESHOLD,
  INVIEW_ROOT_MARGIN,
  INVIEW_VISIBLE_CLASS,
  INVIEW_ONCE,
} from "./../config/ui.config.js";

interface InviewOptions {
  threshold?: number;
  rootMargin?: string;
  visibleClass?: string;
  once?: boolean;
}

interface InviewReturn {
  destroy: () => void;
}

interface ElementObserverConfiguration {
  visibleClass: string;
  once: boolean;
}

// Shared IntersectionObserver instance for better performance
let sharedIntersectionObserver: IntersectionObserver | null = null;
const observedElements = new WeakMap<Element, ElementObserverConfiguration>();
let activeElementCount = 0;

function getSharedIntersectionObserver(): IntersectionObserver {
  if (!sharedIntersectionObserver) {
    sharedIntersectionObserver = new IntersectionObserver(
      (entries) => {
        // Batch DOM updates using requestAnimationFrame
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            const elementConfiguration = observedElements.get(entry.target);
            if (!elementConfiguration) return;

            if (entry.isIntersecting) {
              entry.target.classList.add(elementConfiguration.visibleClass);
              if (elementConfiguration.once && sharedIntersectionObserver) {
                sharedIntersectionObserver.unobserve(entry.target);
                observedElements.delete(entry.target);
                activeElementCount--;
                
                // Clean up observer if no elements are being observed
                if (activeElementCount === 0 && sharedIntersectionObserver) {
                  sharedIntersectionObserver.disconnect();
                  sharedIntersectionObserver = null;
                }
              }
            }
          });
        });
      },
      {
        threshold: INVIEW_THRESHOLD,
        rootMargin: INVIEW_ROOT_MARGIN,
      }
    );
  }
  return sharedIntersectionObserver;
}

// Cleanup function to reset observer (useful for testing or page unload)
export function cleanupInviewObserver() {
  if (sharedIntersectionObserver) {
    sharedIntersectionObserver.disconnect();
    sharedIntersectionObserver = null;
    activeElementCount = 0;
  }
}

export function inview(element: HTMLElement, options: InviewOptions = {}): InviewReturn {
  const {
    threshold = INVIEW_THRESHOLD,
    rootMargin = INVIEW_ROOT_MARGIN,
    visibleClass = INVIEW_VISIBLE_CLASS,
    once = INVIEW_ONCE,
  } = options;

  // Use shared observer for better performance
  const intersectionObserver = getSharedIntersectionObserver();
  observedElements.set(element, { visibleClass, once });
  intersectionObserver.observe(element);
  activeElementCount++;

  return {
    destroy() {
      if (intersectionObserver) {
        intersectionObserver.unobserve(element);
      }
      observedElements.delete(element);
      activeElementCount--;
      
      // Clean up observer if no elements are being observed
      if (activeElementCount === 0 && sharedIntersectionObserver) {
        sharedIntersectionObserver.disconnect();
        sharedIntersectionObserver = null;
      }
    },
  };
}
