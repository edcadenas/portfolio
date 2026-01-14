<script lang="ts">
  import { onMount } from "svelte";
  import { theme } from "../lib/theme";
  import { scrollToElement } from "../lib/scroll";

  interface Profile {
    headline?: string;
    header?: {
      nav?: Array<{
        label: string;
        targetId: string;
      }>;
    };
  }

  export let profile: Profile;

  let headerElement: HTMLElement | null = null;
  let isHeaderOnDarkBackground = false;
  let isAnimationTicking = false;

  const headline = () => profile?.headline ?? "Developer & Designer";
  const navItems = () => profile?.header?.nav ?? [];

  // Sections with dark backgrounds
  const SECTIONS_WITH_DARK_BACKGROUND = ["services", "contact"];

  function computeHeaderMode() {
    if (!headerElement) return;

    const headerRect = headerElement.getBoundingClientRect();

    // Sample a point just below the header (center)
    const samplePointX = Math.floor(headerRect.left + headerRect.width / 2);
    const samplePointY = Math.floor(headerRect.bottom + 1);

    const elementUnderHeader = document.elementFromPoint(samplePointX, samplePointY);
    if (!elementUnderHeader) return;

    const isOnDarkSection = SECTIONS_WITH_DARK_BACKGROUND.some((sectionId) => {
      const sectionElement = document.getElementById(sectionId);
      return sectionElement ? sectionElement.contains(elementUnderHeader) : false;
    });

    isHeaderOnDarkBackground = isOnDarkSection;
  }

  function onScrollOrResize() {
    if (isAnimationTicking) return;
    isAnimationTicking = true;

    requestAnimationFrame(() => {
      computeHeaderMode();
      isAnimationTicking = false;
    });
  }

  onMount(() => {
    computeHeaderMode();

    // Use passive listeners for better scroll performance
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  });
</script>

<nav
  class="header"
  class:header--on-dark={isHeaderOnDarkBackground}
  aria-label="Primary"
  bind:this={headerElement}
>
  <span 
    class="header-tagline" 
    role="button"
    tabindex="0"
    on:click={() => scrollToElement('hero')}
    on:keydown={(e) => e.key === 'Enter' && scrollToElement('hero')}
  >
    {headline()}
  </span>

  <div class="header-right">
    <div class="header-links">
      {#each navItems() as item (item.targetId)}
        <a
          href="#{item.targetId}"
          class="header-link"
          on:click|preventDefault={() => scrollToElement(item.targetId)}
          data-testid={"nav-" + item.targetId}
        >
          {item.label}
        </a>
      {/each}
    </div>

    <button
      class="header-theme-toggle"
      on:click={() => theme.toggle()}
      aria-label="Toggle theme"
      type="button"
    >
      <span class="theme-toggle-track">
        <span class="theme-toggle-thumb" class:theme-toggle-thumb--light={$theme === 'light'}>
          {#if $theme === 'light'}
            <span class="theme-toggle-icon theme-toggle-icon--sun">☀️</span>
          {:else}
            <span class="theme-toggle-icon theme-toggle-icon--moon">🌙</span>
          {/if}
        </span>
      </span>
    </button>
  </div>
</nav>

<style lang="scss">
  @use "../styles/variables" as *;
  @use "../styles/mixins" as *;

  .header {
    position: fixed;
    inset: 0 0 auto 0;
    z-index: $z-index-header;
    padding: $spacing-sm $spacing-sm;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: $color-bg-header;
    backdrop-filter: blur(40px);
    border-bottom: 2px solid $color-accent;
    color: $color-text-secondary;
    opacity: 0.95;
    transition: background-color $transition-base, color $transition-base, border-bottom-color $transition-base, opacity $transition-base;

    .header-tagline {
      display: inline-block;
      font-size: $font-size-xs;
      letter-spacing: $letter-spacing-normal;
      text-transform: lowercase;
      cursor: pointer;
      transition: color $transition-base, transform $transition-base;
      will-change: transform;
      white-space: nowrap;
      flex-shrink: 1;
      min-width: 0;

      &:hover {
        color: $color-accent;
      }

      &:active {
        transform: scale(0.95);
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      flex-shrink: 0;
    }

    .header-links {
      display: inline-grid;
      grid-auto-flow: column;
      gap: 0;
      background: transparent;
      border: none;
    }

    .header-link {
      padding: $spacing-xs 4px;
      font-size: $font-size-xs;
      transition: color $transition-base;
      color: inherit;
      text-decoration: none;
      border-radius: $border-radius-none;
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        color: $color-accent;
      }

      &:focus-visible {
        outline: 2px solid #059669;
        outline-offset: 2px;
      }
    }

    .header-theme-toggle {
      @include button-reset;
      position: relative;
      width: 40px;
      height: 20px;
      padding: 0;
      cursor: pointer;
      background: transparent;
      border: none;
      outline: none;
      transition: transform $transition-base;
      flex-shrink: 0;

      &:hover {
        transform: scale(1.1);
        
        .theme-toggle-thumb {
          transform: translate3d(20px, 0, 0) scale(1.15);
          box-shadow: 0 2px 8px rgba(52, 211, 153, 0.4);
        }

        .theme-toggle-thumb--light {
          transform: translate3d(0, 0, 0) scale(1.15);
        }

        .theme-toggle-icon {
          transform: translate3d(0, 0, 0) rotate(360deg) scale(1.2);
        }
      }

      &:active {
        transform: scale(0.95);
      }

      &:focus-visible {
        outline: 2px solid #059669;
        outline-offset: 2px;
        border-radius: 4px;
      }
    }

    .theme-toggle-track {
      display: block;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      position: relative;
      transition: background-color $transition-base;
    }

    .theme-toggle-thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: $color-bg-primary;
      border-radius: 50%;
      transition: transform $transition-base, background-color $transition-base, box-shadow $transition-base;
      transform: translate3d(20px, 0, 0);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

      &.theme-toggle-thumb--light {
        transform: translate3d(0, 0, 0);
      }
    }

    .theme-toggle-icon {
      font-size: 10px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform $transition-base;
      transform: rotate(0deg) scale(1);
    }
  }

  :global(.light) {
    .header {
      background-color: $color-bg-header-light;
      color: $color-text-secondary-light;
      border-bottom-color: #047857;

      .header-tagline:hover {
        color: #047857;
      }

      .header-link {
        color: inherit;

        &:hover {
          color: #047857;
        }

        &:focus-visible {
          outline-color: #047857;
        }
      }

      .header-theme-toggle {
        &:focus-visible {
          outline-color: #047857;
        }
      }

      .theme-toggle-track {
        background: rgba(0, 0, 0, 0.1);
      }

      .theme-toggle-thumb {
        background: $color-bg-primary-light;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
    }
  }

  @include respond-to(md) {
    .header {
      padding: $spacing-base $spacing-3xl;

      .header-tagline {
        font-size: $font-size-base;
        flex-shrink: 0;
      }

      .header-link {
        font-size: $font-size-base;
        padding: $spacing-xs 8px;
      }

      .header-right {
        gap: $spacing-base;
      }

      .header-theme-toggle {
        width: 48px;
        height: 24px;

        &:hover {
          .theme-toggle-thumb {
            transform: translate3d(24px, 0, 0) scale(1.15);
          }
        }
      }

      .theme-toggle-thumb {
        width: 20px;
        height: 20px;
        transform: translate3d(24px, 0, 0);

        &.theme-toggle-thumb--light {
          transform: translate3d(0, 0, 0);
        }
      }

      .theme-toggle-icon {
        font-size: 12px;
      }
    }
  }
</style>
