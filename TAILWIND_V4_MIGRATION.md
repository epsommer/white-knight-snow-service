# Tailwind CSS v4 Migration Notes

This project uses **Tailwind CSS v4**, which has significant changes from v3.

## Changes Made

### 1. PostCSS Configuration
**File**: `postcss.config.mjs`

Changed from:
```javascript
plugins: {
  tailwindcss: {},
}
```

To:
```javascript
plugins: {
  '@tailwindcss/postcss': {},
}
```

### 2. Global CSS
**File**: `src/app/globals.css`

**Old syntax (v3):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
}
```

**New syntax (v4):**
```css
@import "tailwindcss";

* {
  border-color: hsl(var(--border));
}
```

### 3. Configuration
**Removed**: `tailwind.config.ts`

Tailwind v4 uses **CSS-based configuration** instead of JavaScript config files. All theme customization is done directly in the CSS file using CSS variables.

## Key Differences in v4

1. **No more `@tailwind` directives** - Use `@import "tailwindcss"` instead
2. **No more `@apply`** - Use standard CSS properties
3. **No more `@layer`** - Write CSS directly
4. **No more `tailwind.config.js`** - Configuration via CSS custom properties
5. **New PostCSS plugin** - `@tailwindcss/postcss` instead of `tailwindcss`

## CSS Variables

All theme values are defined as CSS custom properties in `:root`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* etc. */
}
```

Use them in your components:
```css
background-color: hsl(var(--background));
color: hsl(var(--foreground));
```

Or with Tailwind utilities:
```html
<div class="bg-background text-foreground">
```

## Migration Guide for Custom Styles

**Before (v3):**
```css
@layer components {
  .btn-primary {
    @apply bg-primary text-primary-foreground;
  }
}
```

**After (v4):**
```css
.btn-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
```

Or better yet, use Tailwind utilities directly in your JSX:
```jsx
<button className="bg-primary text-primary-foreground">
```

## Utilities Still Work

All Tailwind utility classes work exactly the same:
- `flex`, `grid`, `p-4`, `mt-2`, etc.
- `hover:`, `focus:`, `dark:` variants
- Responsive variants: `sm:`, `md:`, `lg:`

## Benefits of v4

1. **Faster build times** - No config file to parse
2. **Better IDE support** - CSS variables are easier to autocomplete
3. **Simpler mental model** - Just CSS
4. **Smaller bundle size** - More efficient compilation

## Resources

- [Tailwind CSS v4 Alpha Docs](https://tailwindcss.com/docs/v4-alpha)
- [Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
- [CSS-first Configuration](https://tailwindcss.com/docs/v4-alpha#css-first-configuration)
