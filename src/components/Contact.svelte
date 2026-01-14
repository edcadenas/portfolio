<script lang="ts">
  import { inview } from "../lib/inview";

  interface Profile {
    contact?: {
      kicker?: string;
      label?: string;
      lede?: string;
      email?: string;
      socialsLabel?: string;
    };
  }

  interface Social {
    label: string;
    href: string;
  }

  export let profile: Profile;
  export let socials: Social[] = [];
</script>

<section id="contact" class="contact">
  <div class="contact-wrapper">
    <div class="contact-container">
      <div class="contact-grid">
        <div class="contact-left">
          <div class="contact-title-row">
            <h2 class="contact-title">{profile?.contact?.kicker ?? "Let's Work"}</h2>
            <span class="contact-label">{profile?.contact?.label ?? "/Contact"}</span>
          </div>
          <p class="contact-lede">
            {profile?.contact?.lede ?? 
            "I'm currently looking for new opportunities. Whether you have a question or just want to say hi, my inbox is always open."}
          </p>
        </div>

        <div class="contact-right">
          {#if profile?.contact?.email}
            <a 
              href="mailto:{profile.contact.email}" 
              class="contact-email contact-reveal"
              style="transition-delay: 100ms"
              use:inview
            >
              <span class="contact-email-text">{profile.contact.email}</span>
              <span class="contact-email-arrow" aria-hidden="true">↗</span>
            </a>
          {/if}

          {#if socials.length > 0}
            <div class="contact-socials">
              <div class="contact-social-grid">
                {#each socials as social, socialIndex (social.href)}
                  {#if socialIndex > 0}
                    <div class="contact-social-separator"></div>
                  {/if}
                  <a
                    class="contact-social-card contact-reveal"
                    style="transition-delay: {150 + socialIndex * 60}ms"
                    use:inview
                    href={social.href}
                    target={/^https?:\/\//i.test(social.href) ? "_blank" : undefined}
                    rel={/^https?:\/\//i.test(social.href) ? "noopener noreferrer" : undefined}
                    data-testid={`link-${String(social.label).toLowerCase().replace(/\s+/g, "-")}-footer`}
                    aria-label={social.label}
                  >
                    {social.label}
                    <span class="contact-social-arrow" aria-hidden="true">↗</span>
                  </a>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use "../styles/variables" as *;

  .contact {
    width: 100%;
    max-width: 100%;
    background: transparent;
    padding: 0;
    border-top: 1px solid $color-border;
    content-visibility: auto;
    transition: background-color $transition-base, border-top-color $transition-base;
    box-sizing: border-box;
    overflow-x: hidden;

    .contact-wrapper {
      width: 100%;
      max-width: 100%;
      padding: 64px 0 120px 0;
      box-sizing: border-box;
      overflow-x: hidden;
      background: transparent;
      transition: background-color $transition-base;
    }

    .contact-container {
      max-width: 1280px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;
      
      @media (min-width: $breakpoint-md) {
        padding: 0;
      }
    }

    .contact-grid {
      display: grid;
      gap: 40px;
    }

    .contact-left {
      display: flex;
      flex-direction: column;
    }

    .contact-title-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .contact-title {
      margin: 0;
      transition: color $transition-base;
    }

    .contact-label {
      font-size: 14px;
      color: #999;
      font-weight: 400;
      transition: color $transition-base;
    }

    .contact-lede {
      margin: 0;
      font-size: 16px;
      max-width: 56ch;
      box-sizing: border-box;
      transition: color $transition-base;
      line-height: 1.6;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }

    .contact-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 0;
      background-color: transparent;
      border: none;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      contain: layout style;
      transition: background-color $transition-base;
      transform: translateZ(0);
      backface-visibility: hidden;
    }

    .contact-email {
      display: flex;
      align-items: center;
      gap: 4px;
      color: $color-text-primary;
      text-decoration: none;
      transition: color $transition-base;
      cursor: pointer;
      padding: 0;
      min-width: 0;
      width: fit-content;
      max-width: 100%;
      box-sizing: border-box;
      transform: translateZ(0);
      backface-visibility: hidden;
      justify-self: start;

      &:hover {
        color: $color-accent;
      }

      &:focus-visible {
        outline: 2px solid rgba(52, 211, 153, 0.5);
        outline-offset: 4px;
        border-radius: 2px;
      }
    }

    .contact-email-text {
      font-size: 18px;
      font-weight: 700;
      color: $color-text-primary;
      transition: color $transition-base;
    }

    .contact-email:hover .contact-email-text {
      color: $color-accent;
    }

    .contact-email-arrow {
      display: inline-block;
      color: currentColor;
      flex-shrink: 0;
    }

    .contact-socials {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      padding: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }

    /* Social cards - Griddy pills */
    .contact-social-grid {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      gap: 0;
      background-color: transparent;
      border: none;
      border-radius: 0;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      contain: layout style;
      transition: background-color $transition-base;
      transform: translateZ(0);
      backface-visibility: hidden;
    }

    .contact-social-card {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;
      padding: 4px 0;
      min-height: 56px;
      position: relative;
      color: $color-text-primary;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
      letter-spacing: 0.05em;
      cursor: pointer;
      box-sizing: border-box;
      transform: translateZ(0);
      backface-visibility: hidden;
      transition: color $transition-base;

      &:hover {
        color: $color-accent;
      }

      &:focus-visible {
        outline: 2px solid rgba(52, 211, 153, 0.5);
        outline-offset: -2px;
      }
    }

    .contact-social-arrow {
      display: inline-block;
      color: currentColor;
      flex-shrink: 0;
    }

    .contact-social-separator {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      flex-shrink: 0;
      align-self: center;
    }

    /* Scroll reveal animation */
    .contact-reveal {
      opacity: 0;
      transform: translate3d(0, 20px, 0) scale(0.95);
      transition: opacity $transition-base, transform $transition-base;
      will-change: opacity, transform;
      contain: layout style paint;
    }

    :global(.contact-reveal.is-visible) {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
      will-change: auto;
    }
  }

  @media (min-width: 768px) {
    .contact {
      .contact-wrapper {
        padding: 96px 0 200px 0;
      }

      .contact-grid {
        grid-template-columns: 1fr 1fr;
        gap: 60px;
      }

      .contact-title-row {
        gap: 16px;
        margin-bottom: 24px;
      }

      .contact-lede {
        font-size: 18px;
      }

      .contact-email {
        gap: 4px;
      }

      .contact-email-text {
        font-size: 18px;
        padding-left: 10px;
      }


      .contact-social-card {
        padding: 0px 10px;
        min-height: 56px;
        font-size: 13px;
      }
    }
  }

  @media (min-width: 1024px) {
    .contact {
      .contact-wrapper {
        padding: 128px 0 300px 0;
      }

      .contact-email-text {
        font-size: 18px;
      }
    }
  }

  :global(.light) {
    .contact {
      background-color: transparent;
      border-top-color: $color-border-light;

      .contact-wrapper {
        background-color: transparent;
      }

      .contact-label {
        color: $color-text-tertiary-light;
      }

      .contact-title {
        color: $color-text-primary-light;
      }

      .contact-lede {
        color: $color-text-secondary-light;
      }

      .contact-email-text {
        color: $color-text-primary-light;
      }

      .contact-email {
        color: $color-text-primary-light;

        &:hover {
          color: #047857;
        }

        &:hover .contact-email-text {
          color: #047857;
        }
      }

      .contact-right {
        background-color: transparent;
      }

      .contact-social-grid {
        background-color: transparent;
      }

      .contact-social-card {
        background-color: transparent;
        color: $color-text-primary-light;
        text-decoration: none;

        &:hover {
          color: #047857;
        }
      }

      .contact-social-separator {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
</style>
