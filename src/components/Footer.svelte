<script lang="ts">
  interface Profile {
    name?: {
      first?: string;
      last?: string;
    };
    footer?: {
      year?: number;
    };
  }

  export let profile: Profile;
</script>

<footer class="footer">
  <div class="footer-container">
    <span class="footer-name">
      {profile?.name?.first} {profile?.name?.last}
    </span>

    <span class="footer-year">
      © {profile?.footer?.year ?? new Date().getFullYear()}
    </span>
  </div>
</footer>

<style lang="scss">
  @use "../styles/variables" as *;

  .footer {
    padding: 24px;
    background: #0f1113;
    border-top: 2px solid $color-accent;
    color: #999;
    transition: background-color $transition-base, color $transition-base;

    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      padding: 0 20px;
      
      @media (min-width: $breakpoint-md) {
        padding: 0;
      }
    }

    .footer-name {
      line-height: 1.4;
      color: $color-accent;
      font-size: $font-size-base;
      text-shadow: 0 0 30px rgba(52, 211, 153, 0.2), 0 0 60px rgba(52, 211, 153, 0.1), 0 0 90px rgba(52, 211, 153, 0.05);
      will-change: text-shadow;
      animation: glow-pulse 3s ease-in-out infinite;
      transition: color $transition-base;
    }

    @keyframes glow-pulse {
      0%, 100% {
        text-shadow: 0 0 30px rgba(52, 211, 153, 0.2), 0 0 60px rgba(52, 211, 153, 0.1), 0 0 90px rgba(52, 211, 153, 0.05);
      }
      50% {
        text-shadow: 0 0 40px rgba(52, 211, 153, 0.3), 0 0 80px rgba(52, 211, 153, 0.15), 0 0 120px rgba(52, 211, 153, 0.08);
      }
    }

    .footer-year {
      line-height: 1.4;
      transition: color $transition-base;
    }
  }

  @media (min-width: 768px) {
    .footer {
      padding: 24px 48px;
    }
  }

  @media (min-width: 1024px) {
    .footer {
      padding: 24px 80px;
    }
  }

  :global(.light) {
    .footer {
      background-color: rgba(245, 245, 245, 0.95);
      color: $color-text-secondary-light;
      border-top-color: #047857;

      .footer-name {
        color: #047857 !important;
        text-shadow: 0 0 30px rgba(4, 120, 87, 0.2), 0 0 60px rgba(4, 120, 87, 0.1), 0 0 90px rgba(4, 120, 87, 0.05);
        animation: glow-pulse-light 3s ease-in-out infinite;
      }
    }

    @keyframes glow-pulse-light {
      0%, 100% {
        text-shadow: 0 0 30px rgba(4, 120, 87, 0.2), 0 0 60px rgba(4, 120, 87, 0.1), 0 0 90px rgba(4, 120, 87, 0.05);
      }
      50% {
        text-shadow: 0 0 40px rgba(4, 120, 87, 0.3), 0 0 80px rgba(4, 120, 87, 0.15), 0 0 120px rgba(4, 120, 87, 0.08);
      }
    }
  }
</style>
