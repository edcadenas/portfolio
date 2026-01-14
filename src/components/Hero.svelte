<script lang="ts">
  import { onMount } from "svelte";
  import { scrollToElement } from "../lib/scroll";

  interface Profile {
    hero?: {
      status?: {
        enabled?: boolean;
        available?: boolean;
        label?: string;
        unavailableLabel?: string;
        modes?: Array<{
          label: string;
          active: boolean;
        }>;
      };
      headline?: {
        text?: string;
        accents?: string[];
      };
      bio?: string[];
      cta?: {
        label?: string;
        targetId?: string;
      };
    };
  }

  export let profile: Profile;

  let headlineVisible = false;
  let bioVisible = false;
  let actionsVisible = false;

  onMount(() => {
    requestAnimationFrame(() => {
      setTimeout(() => headlineVisible = true, 100);
      setTimeout(() => bioVisible = true, 400);
      setTimeout(() => actionsVisible = true, 700);
    });
  });

  const statusEnabled = () => !!profile?.hero?.status?.enabled;

  const hasAnyActiveMode = () => {
    const modes = profile?.hero?.status?.modes ?? [];
    return modes.length > 0 && modes.some((m) => m?.active);
  };

  function parseHeadline(text: string, accents: string[] = []): Array<{ text: string; isAccent: boolean }> {
    if (!text || accents.length === 0) {
      return [{ text, isAccent: false }];
    }

    const result: Array<{ text: string; isAccent: boolean }> = [];
    let currentIndex = 0;
    const textLower = text.toLowerCase();
    
    // Sort accents by length (longest first) to handle overlapping matches correctly
    const sortedAccents = [...accents].sort((a, b) => b.length - a.length);
    
    // Find all accent matches with their positions
    const matches: Array<{ start: number; end: number; text: string }> = [];
    
    sortedAccents.forEach(accent => {
      const accentLower = accent.toLowerCase();
      let searchIndex = 0;
      
      while (searchIndex < textLower.length) {
        const index = textLower.indexOf(accentLower, searchIndex);
        if (index === -1) break;
        
        // Check if this match overlaps with an existing match
        const overlaps = matches.some(m => 
          (index >= m.start && index < m.end) || 
          (index + accent.length > m.start && index + accent.length <= m.end) ||
          (index < m.start && index + accent.length > m.end)
        );
        
        if (!overlaps) {
          matches.push({
            start: index,
            end: index + accent.length,
            text: text.substring(index, index + accent.length)
          });
        }
        
        searchIndex = index + 1;
      }
    });
    
    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);
    
    // Build result array
    matches.forEach(match => {
      // Add text before match
      if (match.start > currentIndex) {
        result.push({ text: text.substring(currentIndex, match.start), isAccent: false });
      }
      
      // Add matched text as accent
      result.push({ text: match.text, isAccent: true });
      
      currentIndex = match.end;
    });
    
    // Add remaining text
    if (currentIndex < text.length) {
      result.push({ text: text.substring(currentIndex), isAccent: false });
    }
    
    // If no matches found, return whole text
    if (result.length === 0) {
      return [{ text, isAccent: false }];
    }
    
    return result;
  }

  const headlineText = () => profile?.hero?.headline?.text ?? "Building modern web experiences & systems";
  const headlineAccents = () => profile?.hero?.headline?.accents ?? ["modern web", "& systems"];
  const headlineParts = () => parseHeadline(headlineText(), headlineAccents());
</script>

<section id="hero" class="hero">
  <div class="hero-container">
    <h1 
      class="hero-headline hero-reveal" 
      class:hero-reveal--visible={headlineVisible}
      data-testid="text-name"
    >
      {#each headlineParts() as part}
        {#if part.isAccent}
          <span class="hero-accent">{part.text}</span>
        {:else}
          <span class="hero-text">{part.text}</span>
        {/if}
      {/each}
    </h1>

    <div 
      class="hero-bio-grid hero-reveal" 
      class:hero-reveal--visible={bioVisible}
    >
      {#each (profile?.hero?.bio ?? []) as paragraph, idx (idx)}
        <p class="hero-bio">{paragraph}</p>
      {/each}
    </div>

    <div 
      class="hero-actions hero-reveal" 
      class:hero-reveal--visible={actionsVisible}
    >
      {#if statusEnabled()}
        {@const status = profile?.hero?.status}
        {@const allModesInactive = status?.modes?.length > 0 && !hasAnyActiveMode()}
        {@const showUnavailable = allModesInactive}

        <div
          class="hero-availability"
          class:hero-availability--unavailable={showUnavailable}
          role="region"
          aria-label="Work availability"
        >
          <div class="hero-availability-grid">
            <div class="hero-availability-item">
              <span
                class="hero-availability-dot"
                class:hero-availability-dot--off={showUnavailable}
                aria-hidden="true"
              ></span>
              <span class="hero-availability-label">
                {showUnavailable
                  ? (status?.unavailableLabel ?? "Unavailable for work")
                  : (status?.label ?? "Available for work")}
              </span>
            </div>

            {#if status?.modes?.length}
              {#each status.modes as mode, idx (mode.label)}
                <div class="hero-availability-separator"></div>
                <div
                  class="hero-availability-item"
                  class:hero-availability-item--inactive={!mode.active}
                >
                  <span class="hero-availability-mode">
                    {mode.label}
                  </span>
                </div>
              {/each}
            {/if}
          </div>
        </div>
      {/if}
      <a
        class="hero-cta"
        href="#{profile?.hero?.cta?.targetId ?? 'contact'}"
        on:click|preventDefault={() => scrollToElement(profile?.hero?.cta?.targetId ?? "contact")}
      >
        {profile?.hero?.cta?.label ?? "Start Creating"}
        <span class="hero-cta-arrow" aria-hidden="true">↓</span>
      </a>
    </div>
  </div>
</section>

<style lang="scss">
  @use "../styles/variables" as *;

  .hero {
    min-height: 90vh;
    display: flex;
    align-items: center;
    padding: 80px 20px 40px;
    transition: background-color $transition-base, color $transition-base;

    .hero-container {
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
    }
    
    .hero-availability {
      margin-bottom: 18px;

      .hero-availability-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0;
        border: none;
        backdrop-filter: blur(10px);
        transition: background-color $transition-base;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }

      .hero-availability-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 4px;
        min-height: 29px;
        height: 29px;
        line-height: 1;
        position: relative;
        flex: 0 0 auto;
        min-width: fit-content;
        white-space: nowrap;
        background: transparent;
        transition: background-color $transition-base, color $transition-base;
        justify-content: center;

        &--inactive {
          opacity: 0.6;

          .hero-availability-mode {
            text-decoration: line-through;
            text-decoration-thickness: 2px;
            text-decoration-color: rgba(255, 255, 255, 0.3);
          }
        }
      }

      .hero-availability-separator {
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.3);
        flex-shrink: 0;
        align-self: center;
      }

      .hero-availability-dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: #22c55e;
        flex: 0 0 auto;
        align-self: center;
        margin: 0;

        box-shadow:
          0 0 0 3px rgba(34, 197, 94, 0.16),
          0 0 14px rgba(34, 197, 94, 0.55);

        animation: hero-availability-pulse 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        will-change: transform, box-shadow;
      }

      @keyframes hero-availability-pulse {
        0% {
          transform: scale(1);
          box-shadow:
            0 0 0 3px rgba(34, 197, 94, 0.14),
            0 0 12px rgba(34, 197, 94, 0.45);
        }
        50% {
          transform: scale(1.05);
          box-shadow:
            0 0 0 6px rgba(34, 197, 94, 0.10),
            0 0 18px rgba(34, 197, 94, 0.65);
        }
        100% {
          transform: scale(1);
          box-shadow:
            0 0 0 3px rgba(34, 197, 94, 0.14),
            0 0 12px rgba(34, 197, 94, 0.45);
        }
      }

      .hero-availability-dot--off {
        background: #9ca3af;
        box-shadow: none;
        animation: none;
      }

      .hero-availability-label {
        font-size: 12px;
        transition: color $transition-base;
        font-weight: 700;
        color: $color-text-primary;
        white-space: nowrap;
        display: flex;
        align-items: center;
        line-height: 1;
        padding-left: 4px;
      }

      .hero-availability-mode {
        font-size: 12px;
        font-weight: 700;
        color: #bbb; // Improved contrast: #bbb on #141619 = ~7:1 ratio
        white-space: nowrap;
      }
    }

    .hero-availability--unavailable {
      .hero-availability-label {
        color: #999;
      }
    }

    /* --- headline/bio/actions --- */
    .hero-headline {
      margin: 0 0 36px 0;
    }

    .hero-text {
      font-size: 0.95em;
      transition: color $transition-base;
    }

    .hero-accent {
      color: $color-accent;
      font-family: $font-family-secondary;
      font-style: italic;
      font-weight: $font-weight-bold;
      font-synthesis: italic;
      font-size: 1.2em;
      text-shadow: 0 0 30px rgba(52, 211, 153, 0.2), 0 0 60px rgba(52, 211, 153, 0.1), 0 0 90px rgba(52, 211, 153, 0.05);
      will-change: text-shadow;
      animation: glow-pulse 3s ease-in-out infinite;
    }

    @keyframes glow-pulse {
      0%, 100% {
        text-shadow: 0 0 30px rgba(52, 211, 153, 0.2), 0 0 60px rgba(52, 211, 153, 0.1), 0 0 90px rgba(52, 211, 153, 0.05);
      }
      50% {
        text-shadow: 0 0 40px rgba(52, 211, 153, 0.3), 0 0 80px rgba(52, 211, 153, 0.15), 0 0 120px rgba(52, 211, 153, 0.08);
      }
    }

    /* Hero reveal animations */
    .hero-reveal {
      opacity: 0;
      transform: translate3d(0, 30px, 0);
      transition: opacity $transition-base, transform $transition-base;
      will-change: opacity, transform;
    }

    .hero-reveal--visible {
      opacity: 1;
      transform: translate3d(0, 0, 0);
      will-change: auto;
    }

    .hero-bio-grid {
      display: grid;
      gap: 18px;
      max-width: 960px;
      margin-bottom: 34px;
    }

    .hero-bio {
      margin: 0;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
    }

    .hero-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 16px 12px;
      min-height: 56px;
      position: relative;
      color: $color-text-primary;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
      letter-spacing: 0.05em;
      cursor: pointer;
      min-width: 0;
      box-sizing: border-box;
      overflow-wrap: break-word;
      word-wrap: break-word;
      transform: translateZ(0);
      backface-visibility: hidden;
      transition: background-color $transition-base, color $transition-base;
      background: transparent;

      &:hover {
        color: $color-accent;
      }

      &:focus-visible {
        outline: 2px solid rgba(52, 211, 153, 0.5);
        outline-offset: -2px;
      }
    }

    .hero-cta-arrow {
      display: inline-block;
      color: currentColor;
      flex-shrink: 0;
      vertical-align: middle;
      line-height: 1;
      padding-bottom: 5px;
    }
  }

  @media (min-width: 768px) {
    .hero {
      padding: 96px 48px 40px;

      .hero-bio-grid {
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }
    }
  }

  @media (min-width: 1024px) {
    .hero { padding: 96px 80px 40px; }
  }

  :global(.light) {
    .hero {
      .hero-availability-item {
        &--inactive {
          .hero-availability-mode {
            text-decoration-color: rgba(0, 0, 0, 0.3);
          }
        }
      }

      .hero-availability-mode {
        color: #555; // Improved contrast: #555 on #fafafa = ~7:1 ratio
      }

      .hero-availability-separator {
        background-color: rgba(0, 0, 0, 0.3);
      }

      .hero-availability-label {
        color: $color-text-primary-light;
      }

      .hero-headline {
        color: $color-text-primary-light;
      }

      .hero-accent {
        color: #047857;
        text-shadow: 0 0 30px rgba(4, 120, 87, 0.2), 0 0 60px rgba(4, 120, 87, 0.1), 0 0 90px rgba(4, 120, 87, 0.05);
        animation: glow-pulse-light 3s ease-in-out infinite;
      }

      @keyframes glow-pulse-light {
        0%, 100% {
          text-shadow: 0 0 30px rgba(4, 120, 87, 0.2), 0 0 60px rgba(4, 120, 87, 0.1), 0 0 90px rgba(4, 120, 87, 0.05);
        }
        50% {
          text-shadow: 0 0 40px rgba(4, 120, 87, 0.3), 0 0 80px rgba(4, 120, 87, 0.15), 0 0 120px rgba(4, 120, 87, 0.08);
        }
      }

      .hero-cta {
        background: transparent;
        color: $color-text-primary-light;
        text-decoration: none;

        &:hover {
          color: #047857;
        }

        &:focus-visible {
          outline-color: rgba(4, 120, 87, 0.5);
        }
      }
    }
  }
</style>
