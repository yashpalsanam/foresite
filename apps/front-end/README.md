# 🏡 Foresite Real Estate - User Website

A modern, SEO-optimized real estate website built with **Next.js 14**, **React**, **TailwindCSS**, and integrated with **Cloudinary** for image optimization.

## 🚀 Features

- ⚡ **Server-Side Rendering (SSR)** for optimal SEO and performance
- 🎨 **Responsive Design** with TailwindCSS
- 🖼️ **Image Optimization** via Next/Image + Cloudinary
- 🔍 **Property Search & Filtering** with real-time results
- 📱 **Mobile-First** approach
- 🌐 **Multi-language Support** (English, Spanish)
- 📊 **Analytics Integration** ready
- ♿ **Accessibility** compliant (WCAG 2.1)
- 🔒 **Security Headers** configured
- 🚦 **Incremental Static Regeneration (ISR)**

## 📋 Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Backend API running (see `/backend` folder)

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/your-org/foresite-app.git
cd foresite-app/website

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Update .env.local with your configuration
# Edit: API URL, Cloudinary credentials, Google Maps API key
```

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🚀 Running the Application

```bash
# Development mode
npm run dev
# Runs on http://localhost:3000

# Production build
npm run build
npm run start

# Run tests
npm run test

# Bundle analysis
npm run analyze
```

## 📁 Project Structure

```
website/
├── public/              # Static assets (images, icons, favicon)
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Next.js pages (routes)
│   ├── utils/          # Helper functions & API client
│   ├── hooks/          # Custom React hooks
│   ├── context/        # Global state management
│   ├── styles/         # Global styles & Tailwind
│   └── lib/            # Server-side utilities
├── tests/              # Unit & integration tests
└── README.md
```

## 🌐 Key Routes

- `/` - Homepage (hero, featured properties, CTAs)
- `/properties` - Property listings with filters
- `/property/[id]` - Individual property details (SSR)
- `/about` - About the company
- `/contact` - Contact form

## 🎨 Styling

This project uses **TailwindCSS** with custom configuration:

- Custom color palette (primary, secondary, accent)
- Responsive breakpoints
- Custom animations & transitions
- Typography system

## 🔌 API Integration

All API calls are handled through a centralized Axios instance (`src/utils/apiClient.js`):

```javascript
import apiClient from '@/utils/apiClient';

const properties = await apiClient.get('/properties');
```

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
docker build -t foresite-website .
docker run -p 3000:3000 foresite-website
```

### Static Export

```bash
npm run build
npm run export
# Outputs to /out directory
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:ci

# Watch mode
npm run test -- --watch
```

## 📊 Performance

- Lighthouse Score: 95+ (Performance, SEO, Accessibility)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Cumulative Layout Shift: < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For issues or questions:
- Email: support@foresite.com
- Slack: #foresite-dev

## 🔗 Related Projects

- Backend API: `/backend`
- Admin Panel: `/admin-panel`

---

**Built with ❤️ by the Foresite Team**
