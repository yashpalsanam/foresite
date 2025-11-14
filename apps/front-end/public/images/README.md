# Public Images Directory

## Required Image Assets

This directory should contain all static images used throughout the website.

### 1. Hero Section Images
- `hero-bg.jpg` (1920x1080px) - Homepage hero background
- `hero-mobile.jpg` (750x1334px) - Mobile hero background

### 2. Property Placeholder Images
- `property-placeholder.jpg` (800x600px) - Default property image
- `no-image.svg` - Fallback when no image available

### 3. About Page Images
- `team-photo.jpg` (1200x800px) - Team or office photo
- `mission-bg.jpg` (1920x1080px) - Mission section background

### 4. Icons for PWA
Create icons in these sizes:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

### 5. Social Media / OG Images
- `og-image.jpg` (1200x630px) - Open Graph default image
- `twitter-card.jpg` (1200x675px) - Twitter card image

### 6. Screenshots (for PWA)
- `screenshot-1.png` (1280x720px) - Desktop screenshot
- `screenshot-2.png` (750x1334px) - Mobile screenshot

## Image Optimization Tips

1. **Use WebP format** when possible for better compression
2. **Compress images** before uploading (use TinyPNG, Squoosh)
3. **Provide multiple sizes** for responsive images
4. **Use Cloudinary** for dynamic property images
5. **Lazy load** images below the fold

## Next.js Image Component

Always use the Next.js Image component for optimization:

```jsx
import Image from 'next/image';

<Image 
  src="/images/hero-bg.jpg"
  alt="Beautiful property"
  width={1920}
  height={1080}
  priority // Use for above-the-fold images
  quality={85}
/>
```

## Cloudinary Integration

For user-uploaded property images, use Cloudinary URLs:

```jsx
<Image 
  src="https://res.cloudinary.com/your-cloud/image/upload/v1234567890/property-123.jpg"
  alt="Property"
  width={800}
  height={600}
  loader={cloudinaryLoader}
/>
```

## Placeholder Images

While building, you can use placeholder services:
- https://via.placeholder.com/800x600
- https://picsum.photos/800/600
- https://placehold.co/800x600
