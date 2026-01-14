<script lang="ts">
  import { inview } from "../lib/inview";

  interface Profile {
    services?: {
      title?: string;
      label?: string;
      lede?: string;
    };
  }

  interface Service {
    title: string;
    description: string;
    tools?: string[];
  }

  export let profile: Profile;
  export let services: Service[] = [];
</script>

<section id="services" class="services">
  <div class="services-container">
    <div class="services-title-row">
      <h2 class="services-title">{profile?.services?.title ?? "What I Do"}</h2>
      <span class="services-label">{profile?.services?.label ?? "/Services"}</span>
    </div>

    <p class="services-lede">
      {profile?.services?.lede ??
      "I specialize in building full-stack web applications that are fast, reliable, and user-friendly."}
    </p>

    <div class="services-grid">
      {#each services as service, serviceIndex (service.title)}
        <div 
          class="services-card services-reveal"
          style="transition-delay: {serviceIndex * 100}ms"
          use:inview
        >
          <h3 class="services-card-title">{service.title}</h3>
          <p class="services-card-desc">{service.description}</p>

          {#if service.tools?.length}
            <div class="services-tools">
              {#each service.tools as toolName, toolIndex (toolName)}
                {#if toolIndex > 0}
                  <div class="services-tool-separator"></div>
                {/if}
                <span class="services-tool">
                  {toolName}
                </span>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<style lang="scss">
  @use "../styles/variables" as *;

  .services {
    padding: 64px 0;
    background: transparent;
    color: $color-text-primary;
    border-top: 1px solid $color-border;
    content-visibility: auto;
    transition: background-color $transition-base, color $transition-base, border-top-color $transition-base;

    .services-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
      
      @media (min-width: $breakpoint-md) {
        padding: 0;
      }
    }

    .services-title-row {
      display: flex;
      align-items: baseline;
      gap: 16px;
      margin-bottom: 24px;
    }

    .services-title {
      margin: 0;
    }

    .services-label {
      font-size: 14px;
      color: #999;
      font-weight: 400;
      transition: color $transition-base;
    }

    .services-lede {
      font-size: 18px;
      max-width: 720px;
      margin: 0 0 16px 0;
    }

    .services-grid {
      display: grid;
      grid-template-columns: 1fr;
      grid-auto-rows: auto;
      gap: 8px;
      row-gap: 8px;
      column-gap: 16px;
      background-color: transparent;
      border: none;
      contain: layout style;
      transition: background-color $transition-base;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      transform: translateZ(0);
      backface-visibility: hidden;
    }

    .services-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      position: relative;
      padding: 16px 0;
      min-width: 0;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      transform: translateZ(0);
      backface-visibility: hidden;
      transition: background-color $transition-base;
      background: transparent;
    }

    /* Scroll reveal animation */
    .services-reveal {
      opacity: 0;
      transform: translate3d(0, 20px, 0) scale(0.95);
      transition: opacity $transition-base, transform $transition-base;
      will-change: opacity, transform;
      contain: layout style paint;
    }

    :global(.services-reveal.is-visible) {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
      will-change: auto;
    }

    .services-card-title {
      margin: 16px 0 16px;
      font-size: 22px;
      font-weight: 700;
      color: $color-text-primary;
      transition: color $transition-base;
    }

    .services-card-desc {
      margin: 0 0 24px 0;
      transition: color $transition-base;
    }

    .services-tools {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      row-gap: 4px;
      column-gap: 4px;
      background: transparent;
      border: none;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }

    .services-tool {
      position: relative;
      font-size: 11px;
      color: #999;
      padding: 5px 4px;
      min-height: 29px;
      height: 29px;
      line-height: 1;
      flex: 0 0 auto;
      min-width: fit-content;
      white-space: nowrap;
      background: transparent;
      display: flex;
      align-items: center;
      min-width: 0;
      box-sizing: border-box;
      overflow-wrap: break-word;
      word-wrap: break-word;
      transform: translateZ(0);
      backface-visibility: hidden;
      transition: background-color $transition-base, color $transition-base;
    }

    .services-tool-separator {
      display: none;
    }
  }

  @media (min-width: 768px) {
    .services {
      padding: 96px 0;

      .services-lede {
        margin: 0 0 40px 0;
      }

      .services-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        grid-auto-rows: 1fr;
        gap: 24px;
        row-gap: 24px;
        column-gap: 24px;
      }

      .services-card {
        padding: 24px 0;
      }

      .services-tools {
        gap: 0;
        row-gap: 0;
        column-gap: 0;
      }

      .services-tool-separator {
        display: block;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.3);
        flex-shrink: 0;
        align-self: center;
      }
    }
  }

  @media (min-width: 1024px) {
    .services {
      padding: 128px 0;
    }
  }

  :global(.light) {
    .services {
      background-color: transparent;
      color: $color-text-primary-light;
      border-top-color: $color-border-light;

      .services-label {
        color: $color-text-tertiary-light;
      }

      .services-title {
        color: $color-text-primary-light;
      }

      .services-grid {
        background-color: transparent;
      }

      .services-card {
        background: transparent;
      }

      .services-card-title {
        color: $color-text-primary-light;
      }

      .services-tools {
        background: transparent;
      }

      .services-tool {
        background: transparent;
        color: $color-text-tertiary-light;
      }

      .services-tool-separator {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
</style>
