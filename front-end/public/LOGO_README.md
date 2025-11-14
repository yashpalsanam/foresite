# Logo Assets

## Required Logo Files

Place your logo files in this directory:

1. **logo.png** (Primary logo)
   - Recommended size: 512x512px or 1024x1024px
   - Format: PNG with transparent background
   - Usage: Navbar, footer, general branding

2. **logo-white.png** (White version for dark backgrounds)
   - Same dimensions as logo.png
   - White/light color variant

3. **logo-icon.png** (Icon-only version)
   - Square format: 256x256px
   - For mobile nav, favicons, small spaces

## Placeholder SVG Logo

Until you add your actual logo, you can use this inline SVG:

```html
<svg width="150" height="40" xmlns="http://www.w3.org/2000/svg">
  <rect width="150" height="40" fill="#0ea5e9" rx="5"/>
  <text x="75" y="28" font-size="24" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold">
    FORESITE
  </text>
</svg>
```

## Integration

Import in components:
```jsx
import Image from 'next/image';
import logo from '@/public/logo.png';

<Image src={logo} alt="Foresite Logo" width={150} height={40} />
```
