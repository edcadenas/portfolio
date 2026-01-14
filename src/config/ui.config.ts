export const UI_CONFIG = {
  animations: {
    inview: {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
      visibleClass: "is-visible",
      once: true,
    },
  },
};

export const INVIEW_THRESHOLD = UI_CONFIG.animations.inview.threshold;
export const INVIEW_ROOT_MARGIN = UI_CONFIG.animations.inview.rootMargin;
export const INVIEW_VISIBLE_CLASS = UI_CONFIG.animations.inview.visibleClass;
export const INVIEW_ONCE = UI_CONFIG.animations.inview.once;
