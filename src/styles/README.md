# SCSS Standards

This directory contains SCSS variables, mixins, and base styles following best practices.

## File Structure

- `_variables.scss` - All design tokens (colors, spacing, typography, etc.)
- `_mixins.scss` - Reusable mixins for common patterns
- `app.scss` - Global base styles

## Usage in Components

Import variables and mixins at the top of component `<style lang="scss">` blocks:

```scss
<style lang="scss">
  @use "../styles/variables" as *;
  @use "../styles/mixins" as *;

  .my-component {
    padding: $spacing-lg;
    color: $color-text-primary;
    background: $color-bg-primary;
    
    @include respond-to(md) {
      padding: $spacing-xl;
    }
  }
</style>
```

## Best Practices

1. **Always use variables** - Never hardcode colors, spacing, or other design tokens
2. **Use mixins for patterns** - Common patterns like containers, section padding, grid borders
3. **Nesting depth** - Keep nesting to max 3-4 levels
4. **Media queries** - Use `@include respond-to(md)` or `@include respond-to(lg)` mixins
5. **Consistent formatting** - 2-space indentation, consistent spacing
6. **Comments** - Use `//` for SCSS comments, `/* */` only for CSS output

## Available Variables

### Colors
- `$color-bg-primary`, `$color-bg-header`, `$color-bg-overlay`
- `$color-text-primary`, `$color-text-secondary`, `$color-text-tertiary`
- `$color-accent`, `$color-accent-dark`, `$color-accent-light`
- `$color-border`, `$color-border-hover`, `$color-overlay-hover`

### Spacing
- `$spacing-xs` through `$spacing-7xl` (5px to 350px)

### Typography
- Font sizes: `$font-size-xs` through `$font-size-lg`
- Font weights: `$font-weight-normal` through `$font-weight-extrabold`
- Line heights: `$line-height-tight` through `$line-height-loose`

### Breakpoints
- `$breakpoint-md`: 768px
- `$breakpoint-lg`: 1024px

## Available Mixins

- `@include container` - Max-width container with auto margins
- `@include section-padding` - Standard section padding with responsive breakpoints
- `@include section-padding-sm` - Smaller section padding
- `@include grid-border` - Grid item border pattern
- `@include scroll-reveal` - Scroll reveal animation base
- `@include button-reset` - Reset button styles
- `@include focus-visible` - Focus visible styles
- `@include respond-to(md|lg)` - Responsive breakpoint mixin
