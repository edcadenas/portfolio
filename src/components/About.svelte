<script lang="ts">
  import { inview } from "../lib/inview";

  interface Profile {
    about?: {
      kicker?: string;
      label?: string;
      headline?: string;
      body?: string;
      experienceLabel?: string;
    };
    techStack?: {
      title?: string;
    };
  }

  interface Experience {
    id?: string | number;
    title: string;
    company: string;
    start: string;
    end?: string | null;
    isCurrent?: boolean;
    description?: string;
    skills?: string[];
    environment?: string;
  }

  interface SkillCategory {
    name: string;
    skills: string[];
  }

  export let profile: Profile;
  export let experiences: Experience[] = [];
  export let skills: SkillCategory[] = [];

  let expandedExperienceIndices: Record<number, boolean> = {};

  function toggleExperienceExpanded(experienceIndex: number): void {
    expandedExperienceIndices[experienceIndex] = !expandedExperienceIndices[experienceIndex];
    expandedExperienceIndices = expandedExperienceIndices; // trigger reactivity
  }

  const MONTH_ABBREVIATIONS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function formatYearMonth(yearMonth: string | null | undefined): string {
    if (!yearMonth) return "";
    const [year, month] = String(yearMonth).split("-");
    const monthNumber = Number(month);
    if (!year || !monthNumber || monthNumber < 1 || monthNumber > 12) return String(yearMonth);
    return `${MONTH_ABBREVIATIONS[monthNumber - 1]} ${year}`;
  }

  function formatExperienceDateRange(experience: Experience): string {
    const startDate = formatYearMonth(experience.start);
    const endDate = experience.isCurrent || !experience.end ? "Present" : formatYearMonth(experience.end);
    return startDate && endDate ? `${startDate} — ${endDate}` : endDate || startDate || "";
  }
</script>

<section id="about" class="about">
  <div class="about-container">
    <div class="about-grid">
      <div class="about-left">
        <div class="about-title-row">
          <h2 class="about-title">{profile?.about?.kicker ?? "About Me"}</h2>
          <span class="about-label">{profile?.about?.label ?? "/About"}</span>
        </div>

        <h2 class="about-headline">
          {profile?.about?.headline ??
          "I'm a software engineer driven by a passion for turning ideas into clean, intuitive digital experiences."}
        </h2>

        <p class="about-body">
          {profile?.about?.body ??
          "Beyond coding, I thrive in collaborative environments and enjoy tackling challenging problems with creative solutions. I aim to contribute to impactful projects that make a difference."}
        </p>
      </div>

      <div class="about-right">
        <span class="about-kicker">{profile?.about?.experienceLabel ?? "Experience"}</span>

        <div class="about-experience-list">
          {#each experiences as experience, experienceIndex (experience.id ?? experienceIndex)}
            {@const isCurrentExperience = experience.isCurrent || !experience.end}
            {@const isExpanded = expandedExperienceIndices[experienceIndex]}
            <div 
              class="about-experience-item about-reveal" 
              class:about-experience-item--current={isCurrentExperience}
              class:about-experience-item--expanded={isExpanded}
              style="transition-delay: {experienceIndex * 80}ms"
              use:inview
              on:click={() => toggleExperienceExpanded(experienceIndex)}
              role="button"
              tabindex="0"
              on:keydown={(e) => e.key === 'Enter' && toggleExperienceExpanded(experienceIndex)}
              data-testid={"article-experience-" + (experience.id ?? experienceIndex)}
            >
              <div class="about-experience-row">
                <div class="about-experience-meta">
                  <h3 class="about-experience-role">{experience.title}</h3>
                  <p class="about-experience-company">{experience.company}</p>
                </div>

                <div class="about-experience-right">
                  <span class="about-experience-when">{formatExperienceDateRange(experience)}</span>
                  <svg 
                    class="about-experience-icon"
                    class:about-experience-icon--expanded={isExpanded}
                    width="14" 
                    height="14" 
                    viewBox="0 0 16 16" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M4 6L8 10L12 6" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {#if isExpanded}
                <div class="about-experience-content">
                  {#if experience.description}
                    <p class="about-experience-description">{experience.description}</p>
                  {/if}

                  {#if experience.environment}
                    <div class="about-experience-section">
                      <span class="about-experience-section-label">Environment</span>
                      <p class="about-experience-environment">{experience.environment}</p>
                    </div>
                  {/if}

                  {#if experience.skills && experience.skills.length > 0}
                    <div class="about-experience-section">
                      <span class="about-experience-section-label">Skills</span>
                      <div class="about-experience-pills">
                        {#each experience.skills as skillName, skillIndex (skillName)}
                          {#if skillIndex > 0}
                            <div class="about-experience-pill-separator"></div>
                          {/if}
                          <span class="about-experience-pill">{skillName}</span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
            {#if experienceIndex < experiences.length - 1}
              <div class="about-experience-separator"></div>
            {/if}
          {/each}
        </div>

        {#if skills.length > 0}
          <div class="about-tech-stack">
            <span class="about-kicker">{profile?.techStack?.title ?? "Tech Stack"}</span>
            <div class="about-skills-sections">
              {#each skills as category}
                {#if category.skills.length > 0}
                  <div class="about-skills-section">
                    <h3 class="about-skills-section-title">{category.name}</h3>
                    <div class="about-skills-pills">
                      {#each category.skills as skillName, skillIndex (skillName)}
                        <div 
                          class="about-skills-pill about-reveal" 
                          style="transition-delay: {skillIndex * 30}ms"
                          use:inview
                          data-testid={`pill-skill-${category.name}-${skillIndex}`}
                          role="presentation"
                        >
                          <span class="about-skills-pill-name">{skillName}</span>
                        </div>
                        {#if skillIndex < category.skills.length - 1}
                          <div class="about-skills-pill-separator"></div>
                        {/if}
                      {/each}
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use "../styles/variables" as *;

  .about {
    padding: 64px 0;
    border-top: 1px solid $color-border;
    content-visibility: auto;
    background: transparent;
    transition: background-color $transition-base, color $transition-base, border-top-color $transition-base;

    .about-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 20px;
      
      @media (min-width: $breakpoint-md) {
        padding: 0;
      }
    }

    .about-grid {
      display: grid;
      gap: 40px;
    }

    .about-title-row {
      display: flex;
      align-items: baseline;
      gap: 16px;
      margin-bottom: 24px;
    }

    .about-title {
      margin: 0;
    }

    .about-label {
      font-size: 14px;
      color: #999;
      font-weight: 400;
      transition: color $transition-base;
    }

    .about-kicker {
      display: block;
      margin-bottom: 16px;
      font-size: 12px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #34d399;
      font-weight: 700;
    }

    .about-headline {
      margin: 0 0 32px 0;
      max-width: 56ch;
      font-size: clamp(32px, 4vw, 56px);
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.2;
      color: $color-text-primary;
      transition: color $transition-base;
    }

    .about-body {
      margin: 0;
      max-width: 56ch;
    }

    .about-experience-list {
      display: grid;
      grid-template-columns: 1fr;
      grid-auto-rows: min-content;
      gap: 8px 24px;
      row-gap: 8px;
      column-gap: 24px;
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

    .about-experience-item {
      position: relative;
      padding: 16px 0;
      min-height: 83px;
      min-width: 0;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      transform: translateZ(0);
      backface-visibility: hidden;
      transition: background-color $transition-base;
      cursor: pointer;
      background: transparent;
    }

    /* Scroll reveal animation */
    .about-reveal {
      opacity: 0;
      transform: translate3d(0, 20px, 0) scale(0.95);
      transition: opacity $transition-base, transform $transition-base;
      will-change: opacity, transform;
      contain: layout style paint;
    }

    :global(.about-reveal.is-visible) {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
      will-change: auto;
    }

    .about-experience-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .about-experience-right {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      padding: 0;
    }

    .about-experience-role {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: $color-text-primary;
      transition: color $transition-base;
    }

    .about-experience-item--current .about-experience-role {
      color: #34d399;
    }

    .about-experience-company {
      margin: 6px 0 0 0;
      font-size: 13px;
      color: $color-text-secondary;
      transition: color $transition-base;
    }

    .about-experience-item--current .about-experience-company {
      color: rgba(52, 211, 153, 0.7);
    }

    .about-experience-when {
      font-size: 11px;
      white-space: nowrap;
      color: #999;
      transition: color $transition-base;
    }

    .about-experience-item--current .about-experience-when {
      color: rgba(52, 211, 153, 0.6);
    }

    .about-experience-icon {
      width: 14px;
      height: 14px;
      color: #666;
      transition: transform $transition-base, color $transition-base;
      flex-shrink: 0;
      margin: 0;
      padding: 0;
      display: block;
    }

    .about-experience-icon--expanded {
      transform: rotate(180deg);
    }

    .about-experience-item:hover .about-experience-icon {
      color: #888;
    }

    .about-experience-content {
      padding-top: 16px;
      overflow: hidden;
      animation: slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      will-change: opacity, transform;
    }

    @keyframes slideDown {
      0% {
        opacity: 0;
        transform: translate3d(0, -15px, 0) scale(0.98);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
        will-change: auto;
      }
    }

    .about-experience-description {
      margin: 0 0 16px 0;
      font-size: 14px;
      color: #888;
      line-height: 1.6;
      transition: color $transition-base;
    }


    .about-experience-section {
      margin-top: 16px;

      &:first-of-type {
        margin-top: 0;
      }
    }

    .about-experience-section-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #34d399;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .about-experience-environment {
      font-size: 13px;
      color: #888;
      line-height: 1.6;
      margin: 0;
    }

    .about-experience-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0;
      row-gap: 0;
      column-gap: 0;
      background: transparent;
      border: none;
      border-radius: 0;
      width: 100%;
      max-width: 100%;
    }

    .about-experience-pill {
      position: relative;
      font-size: 11px;
      color: #999;
      padding: 5px 8px;
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

    .about-experience-pill-separator {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      flex-shrink: 0;
      align-self: center;
    }

    .about-experience-separator {
      height: 1px;
      width: 100%;
      background: repeating-linear-gradient(
        to right,
        rgba(255, 255, 255, 0.1) 0px,
        rgba(255, 255, 255, 0.1) 4px,
        transparent 4px,
        transparent 8px
      );
      margin: 0;
      padding: 0;
      grid-column: 1 / -1;
      display: block;
      flex-shrink: 0;
      min-height: 1px;
      position: relative;
      z-index: 1;
    }

    .about-tech-stack {
      margin-top: 32px;
    }

    .about-skills-sections {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .about-skills-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .about-skills-section-title {
      margin: 0;
      font-size: 11px;
      font-weight: 600;
      color: $color-text-secondary;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: color $transition-base;
    }

    .about-skills-pills {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
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

    .about-skills-pill {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px 5px;
      min-height: 28px;
      min-width: 40px;
      position: relative;
      color: $color-text-primary;
      box-sizing: border-box;
      transform: translateZ(0);
      backface-visibility: hidden;
      transition: background-color $transition-base, color $transition-base;
    }

    .about-skills-pill-name {
      color: $color-text-primary;
      font-size: 11px;
      font-weight: 500;
      text-align: center;
      transition: color $transition-base;
      white-space: nowrap;
    }

    .about-skills-pill-separator {
      width: 2px;
      height: 2px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      flex-shrink: 0;
      margin: 0 4px;
    }
  }

  @media (min-width: 768px) {
    .about {
      padding: 96px 0;

      .about-grid {
        grid-template-columns: 1fr 1fr;
        gap: 60px;
      }
    }
  }

  @media (min-width: 1024px) {
    .about {
      padding: 128px 0;
    }
  }

  :global(.light) {
    .about {
      background-color: transparent;
      border-top-color: $color-border-light;

      .about-label {
        color: $color-text-tertiary-light;
      }

      .about-title {
        color: $color-text-primary-light;
      }

      .about-headline {
        color: $color-text-primary-light;
      }

      .about-experience-list {
        background-color: transparent;
      }

      .about-experience-item {
        background: transparent;
      }

      .about-experience-content {
        // No border needed
      }

      .about-experience-role {
        color: $color-text-primary-light;
      }

      .about-experience-company {
        color: $color-text-secondary-light;
      }

      .about-experience-when {
        color: $color-text-tertiary-light;
      }

      .about-experience-item--current .about-experience-role {
        color: #047857;
      }

      .about-experience-item--current .about-experience-company {
        color: #059669;
      }

      .about-experience-item--current .about-experience-when {
        color: #047857;
      }

      .about-experience-description {
        color: $color-text-secondary-light;
      }

      .about-kicker {
        color: #047857;
      }

      .about-experience-pills {
        background: transparent;
      }

      .about-experience-pill {
        background: transparent;
        color: $color-text-tertiary-light;
      }

      .about-experience-pill-separator {
        background-color: rgba(0, 0, 0, 0.3);
      }

      .about-experience-separator {
        background: repeating-linear-gradient(
          to right,
          rgba(0, 0, 0, 0.15) 0px,
          rgba(0, 0, 0, 0.15) 4px,
          transparent 4px,
          transparent 8px
        );
      }

      .about-skills-section-title {
        color: $color-text-secondary-light;
      }

      .about-skills-pills {
        background-color: transparent;
      }

      .about-skills-pill {
        background-color: transparent;
        color: $color-text-primary-light;
      }

      .about-skills-pill-name {
        color: $color-text-primary-light;
      }

      .about-skills-pill-separator {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }

  @media (min-width: 768px) {
    .about {
      .about-tech-stack {
        margin-top: 40px;
      }

      .about-skills-sections {
        gap: 14px;
      }

      .about-skills-section {
        gap: 7px;
      }

      .about-skills-section-title {
        font-size: 12px;
      }

      .about-skills-pill {
        padding: 4px 6px;
        min-height: 32px;
        min-width: 50px;
      }

      .about-skills-pill-name {
        font-size: 12px;
      }

      .about-skills-pill-separator {
        width: 3px;
        height: 3px;
        margin: 0 6px;
      }
    }
  }
</style>
