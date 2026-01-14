<script lang="ts">
  import { inview } from "../lib/inview";

  interface Profile {
    projects?: {
      title?: string;
      label?: string;
      lede?: string;
    };
  }

  interface Project {
    id?: string | number;
    slug?: string;
    name?: string;
    title?: string;
    description?: string;
    desc?: string;
    imageUrl?: string;
    image_url?: string;
    image?: string;
    thumbnail?: string;
    techStack?: string[];
    tech_stack?: string[];
    stack?: string[];
    link?: string;
    url?: string;
    employer?: string;
    company?: string;
    isClientProject?: boolean;
    contribution?: string;
    contributionDetails?: string[];
  }

  export let profile: Profile;
  export let projects: Project[] = [];

  // Field getters with fallback support for schema variations
  function getProjectImageUrl(project: Project): string {
    return project?.imageUrl ?? project?.image_url ?? project?.image ?? project?.thumbnail ?? "";
  }

  function getProjectTechStack(project: Project): string[] {
    return project?.techStack ?? project?.tech_stack ?? project?.stack ?? [];
  }

  function getProjectName(project: Project): string {
    return project?.name ?? project?.title ?? "Untitled";
  }

  function getProjectDescription(project: Project): string {
    return project?.description ?? project?.desc ?? "";
  }

  function getProjectLink(project: Project): string {
    return project?.link ?? project?.url ?? "";
  }

  function getProjectEmployer(project: Project): string {
    return project?.employer ?? project?.company ?? "";
  }

  function getProjectContribution(project: Project): string {
    return project?.contribution ?? "";
  }

  function getProjectContributionDetails(project: Project): string[] {
    return project?.contributionDetails ?? [];
  }

  function isClientProject(project: Project): boolean {
    return project?.isClientProject ?? !!getProjectEmployer(project);
  }
</script>

<section id="projects" class="projects">
  <div class="projects-container">
    <div class="projects-title-row">
      <h2 class="projects-title">{profile?.projects?.title ?? "Portfolio"}</h2>
      <span class="projects-label">{profile?.projects?.label ?? "/Projects"}</span>
    </div>

    <p class="projects-lede">
      {profile?.projects?.lede ??
      "Thoughtfully crafted digital experiences that blend utility and aesthetics into something functional and refined."}
    </p>

    {#if !projects?.length}
      <!-- Debug-friendly empty state so it doesn't look "broken" -->
      <div class="projects-empty">
        <p class="projects-empty-title">No projects found</p>
        <p class="projects-empty-body">
          Make sure <code>projects.json</code> is imported and passed to <code>&lt;Projects /&gt;</code> in
          <code>App.svelte</code>.
        </p>
      </div>
    {:else}
      <div class="projects-list">
        {#each projects as project, projectIndex (project.id ?? project.slug ?? projectIndex)}
          <article
            class="projects-item projects-reveal"
            class:projects-item--reverse={projectIndex % 2 === 1}
            use:inview
            data-testid={"article-project-" + (project.id ?? projectIndex)}
          >
            <div class="projects-copy">
              <div class="projects-header">
                <h3 class="projects-name">{getProjectName(project)}</h3>
              </div>

              <p class="projects-desc">{getProjectDescription(project)}</p>

              {#if isClientProject(project) && getProjectContribution(project)}
                <div class="projects-contribution">
                  <span class="projects-contribution-label">Contributions</span>
                  <p class="projects-contribution-text">{getProjectContribution(project)}</p>
                  {#if getProjectContributionDetails(project).length > 0}
                    <ul class="projects-contribution-list">
                      {#each getProjectContributionDetails(project) as contributionDetail}
                        <li class="projects-contribution-item">{contributionDetail}</li>
                      {/each}
                    </ul>
                  {/if}
                </div>
              {/if}

              {#if getProjectTechStack(project)?.length}
                <div class="projects-chips">
                  {#each getProjectTechStack(project) as technologyName, technologyIndex (technologyName)}
                    {#if technologyIndex > 0}
                      <div class="projects-chip-separator"></div>
                    {/if}
                    <span class="projects-chip">{technologyName}</span>
                  {/each}
                </div>
              {/if}

              {#if getProjectLink(project)}
                <a
                  class="projects-link"
                  href={getProjectLink(project)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={"link-project-" + (project.id ?? projectIndex)}
                >
                  View Live
                  <svg 
                    class="projects-link-icon" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path 
                      d="M4 12L12 4M12 4H8M12 4V8" 
                      stroke="currentColor" 
                      stroke-width="1.5" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                    />
                  </svg>
                </a>
              {/if}
            </div>

            <div class="projects-media">
              {#if getProjectImageUrl(project)}
                <div class="projects-frame">
                  <img
                    class="projects-image"
                    src={getProjectImageUrl(project)}
                    alt={getProjectName(project)}
                    loading="lazy"
                    decoding="async"
                    fetchpriority={projectIndex === 0 ? "high" : "auto"}
                  />
                </div>
              {:else}
                <div class="projects-placeholder">
                  <span class="projects-placeholder-text">Preview</span>
                </div>
              {/if}
            </div>
          </article>
          {#if projectIndex < projects.length - 1}
            <div class="projects-separator"></div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  @use "../styles/variables" as *;

  .projects {
    padding: 64px 0;
    border-top: 1px solid $color-border;
    content-visibility: auto;
    background: transparent;
    transition: background-color $transition-base, color $transition-base, border-top-color $transition-base;

    .projects-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 20px;
      
      @media (min-width: $breakpoint-md) {
        padding: 0;
      }
    }

    .projects-title-row {
      display: flex;
      align-items: baseline;
      gap: 16px;
      margin-bottom: 24px;
    }

    .projects-title {
      margin: 0;
    }

    .projects-label {
      font-size: 14px;
      color: #999;
      font-weight: 400;
      transition: color $transition-base;
    }

    .projects-lede {
      font-size: 18px;
      max-width: 560px;
      margin: 0 0 16px 0;
    }

    .projects-empty {
      border: 1px solid $color-border;
      border-radius: 0;
      padding: 18px 18px;
      background: rgba(20, 22, 25, 0.8);

      .projects-empty-title {
        margin: 0 0 6px 0;
        font-weight: 700;
        color: $color-text-primary;
      }

      .projects-empty-body {
        margin: 0;
        color: #888;
        line-height: 1.6;

        code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.95em;
          background: rgba(255, 255, 255, 0.1);
          padding: 0 6px;
          border-radius: 8px;
        }
      }
    }

    .projects-list {
      display: grid;
      gap: 0 24px;
      row-gap: 0;
      column-gap: 24px;
      background-color: transparent;
      border: none;
      contain: layout style;
      transition: background-color $transition-base;
    }

    .projects-item {
      position: relative;
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      align-items: start;
      padding: 24px 0;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      transition: background-color $transition-base;
      background: transparent;
    }

    .projects-copy {
      order: 1;
    }

    .projects-media {
      order: 2;
    }

    .projects-item--reverse {
      .projects-copy {
        order: 1;
      }
      .projects-media {
        order: 2;
      }
    }

    .projects-separator {
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
      grid-column: 1 / -1;
    }

    .projects-copy {
      min-width: 0;
      overflow-wrap: break-word;
    }

    .projects-media {
      min-width: 0;
      width: 100%;
    }


    .projects-header {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 8px;
      flex-wrap: wrap;
      word-break: break-word;
    }

    .projects-name {
      margin: 0;
      transition: color $transition-base;
    }


    .projects-desc {
      margin: 0 0 24px 0;
      transition: color $transition-base;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .projects-contribution {
      margin: 0 0 24px 0;
      padding: 16px;
      background: rgba(52, 211, 153, 0.05);
      border-left: 2px solid rgba(52, 211, 153, 0.3);
      backdrop-filter: blur(10px);
      opacity: 0.9;
      transition: opacity $transition-base;
    }

    .projects-contribution-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #34d399;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .projects-contribution-text {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #888;
      transition: color $transition-base;
      line-height: 1.6;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .projects-contribution-list {
      margin: 0;
      padding-left: 20px;
      list-style: none;
    }

    .projects-contribution-item {
      position: relative;
      margin: 0 0 8px 0;
      padding-left: 16px;
      font-size: 13px;
      color: #888;
      line-height: 1.6;
      transition: color $transition-base;
      word-wrap: break-word;
      overflow-wrap: break-word;

      &:last-child {
        margin-bottom: 0;
      }

      &::before {
        content: "•";
        position: absolute;
        left: 0;
        color: #34d399;
        font-weight: 700;
      }
    }

    .projects-chips {
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
      margin-bottom: 24px;
    }

    .projects-chip {
      position: relative;
      font-size: 11px;
      color: #999;
      padding: 5px 8px;
      min-height: 29px;
      height: 29px;
      line-height: 1;
      white-space: nowrap;
      flex: 0 0 auto;
      min-width: fit-content;
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

    .projects-chip-separator {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      flex-shrink: 0;
      align-self: center;
    }

    .projects-link {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;
      padding: 0;
      margin-top: 12px;
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

    .projects-link-icon {
      width: 16px;
      height: 16px;
      color: currentColor;
      flex-shrink: 0;
    }

    .projects-frame,
    .projects-placeholder {
      aspect-ratio: 4 / 3;
      border-radius: 0;
      overflow: hidden;
      background: transparent;
      border: 1px solid $color-border;
      width: 100%;
      max-width: 100%;
    }

    .projects-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;

      filter: grayscale(1);
      transition: filter $transition-base;
      will-change: filter;
    }

    .projects-item:hover .projects-image {
      filter: grayscale(0);
    }

    .projects-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;

      .projects-placeholder-text {
        color: #999;
        font-size: 14px;
      }
    }

    /* Scroll reveal */
    .projects-reveal {
      opacity: 0;
      transform: translate3d(0, 40px, 0);
      transition: opacity $transition-base, transform $transition-base;
      will-change: opacity, transform;
      contain: layout style paint;
    }

    :global(.is-visible) {
      opacity: 1;
      transform: translate3d(0, 0, 0);
      will-change: auto;
    }
  }

  @media (min-width: 768px) {
    .projects {
      padding: 96px 0;

      .projects-lede {
        margin: 0 0 40px 0;
      }

      .projects-item {
        grid-template-columns: 1fr 1fr;
        gap: 48px;
        padding: 48px 0;
        align-items: center;
      }

      .projects-copy {
        order: initial;
        min-width: 0;
      }

      .projects-media {
        order: initial;
      }

      .projects-item--reverse {
        .projects-copy {
          order: 2;
        }
        .projects-media {
          order: 1;
        }
      }

      .projects-media {
        min-width: 0;
      }
    }
  }

  @media (min-width: 1024px) {
    .projects {
      padding: 128px 0;
    }
  }

  :global(.light) {
    .projects {
      background-color: transparent;

      .projects-label {
        color: $color-text-tertiary-light;
      }

      .projects-title {
        color: $color-text-primary-light;
      }

      .projects-name {
        color: $color-text-primary-light;
      }

      .projects-empty {
        background: rgba(250, 250, 250, 0.8);
        border-color: $color-border-light;

        .projects-empty-title {
          color: $color-text-primary-light;
        }

        .projects-empty-body {
          color: $color-text-secondary-light;

          code {
            background: rgba(0, 0, 0, 0.1);
          }
        }
      }

      .projects-list {
        background-color: transparent;
      }

      .projects-item {
        background: transparent;
        border-color: $color-border-light;
      }

      .projects-separator {
        background: repeating-linear-gradient(
          to right,
          rgba(0, 0, 0, 0.15) 0px,
          rgba(0, 0, 0, 0.15) 4px,
          transparent 4px,
          transparent 8px
        );
      }

      .projects-contribution-text {
        color: $color-text-secondary-light;
      }

      .projects-contribution-label {
        color: #047857;
      }

      .projects-contribution-item {
        color: $color-text-secondary-light;

        &::before {
          color: #047857;
        }
      }

      .projects-chips {
        background: transparent;
      }

      .projects-chip {
        background: transparent;
        color: $color-text-tertiary-light;
      }

      .projects-chip-separator {
        background-color: rgba(0, 0, 0, 0.3);
      }

      .projects-link {
        background-color: transparent;
        color: $color-text-primary-light;
        text-decoration: none;

        &:hover {
          color: #047857;
        }
      }

      .projects-frame,
      .projects-placeholder {
        background: transparent;
        border-color: $color-border-light;
      }
    }
  }
</style>
