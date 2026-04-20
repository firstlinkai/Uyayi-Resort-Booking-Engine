# Uyayi Sa Baybay | Full-Stack Hospitality Engine

[![Live Demo](https://img.shields.io/badge/Live-Demo-1a4d44?style=for-the-badge)](https://uyayi-resort-booking-engine.vercel.app/)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Supabase%20%7C%20Vite-blue?style=for-the-badge)](https://github.com/firstlinkai/Uyayi-Resort)

**Uyayi Sa Baybay** (Lullaby by the Shore) is a high-performance, full-stack digital ecosystem designed for a boutique beachfront camping resort in Aborlan, Palawan. 

Unlike generic "brochure" websites, this is a **Direct Booking Engine** engineered to eliminate third-party commissions and provide a seamless guest experience in low-bandwidth environments.

---

## 🏝️ The "Apurawan" Challenge
Hospitality in rural Palawan faces two major digital hurdles:
1. **Commission Leakage:** Standard platforms (Booking/Agoda) take 15-20% of revenue.
2. **Connectivity:** Traditional "heavy" luxury sites fail to load on provincial 4G/LTE signals.

**The Solution:** A custom "Serverless Full-Stack" architecture that prioritizes speed, authentic storytelling, and data ownership.

## 🛠️ Technical Architecture

### Frontend (The Experience)
- **Framework:** `React 18` with `Vite` for near-instantaneous load times.
- **Styling:** `Tailwind CSS` for a responsive, mobile-first "barefoot luxury" aesthetic.
- **Animations:** `Framer Motion` for smooth, rhythmic transitions reflecting the "Lullaby" theme.
- **Media Optimization:** AI-assisted video generation (`Veo`) and extreme bitrate compression (`Handbrake`) to reduce hero assets from 137MB to **15MB** without quality loss.

### Backend (The Engine)
- **Database:** `Supabase (PostgreSQL)` managing real-time availability for native huts and camping spots.
- **Infrastructure:** Serverless architecture to ensure 99.9% uptime with zero maintenance overhead.
- **Automation:** Built-in logic to transition from manual Messenger-based bookings to a structured, automated database.

## 🚀 Key Features
- **Commission-Free Booking:** A custom-built flow that turns the website into the primary sales tool.
- **Low-Bandwidth Optimization:** Aggressive asset lazy-loading and optimized WebM/MP4 fallbacks for coastal connectivity.
- **Authentic Branding:** A pivot from generic "luxury" to "grounded camping," aligning guest expectations with the raw beauty of Aborlan.
- **Agentic Workflow Ready:** Designed to integrate with `n8n` for automated guest notifications and lead management.

## 📂 Project Structure
```text
├── public/          # Optimized media assets (compressed for web)
├── src/
│   ├── components/  # Atomic UI components (Booking, Hero, Gallery)
│   ├── hooks/       # Custom React hooks for Supabase logic
│   ├── lib/         # Database client configurations
│   └── styles/      # Tailwind configurations for branding



👨‍💻 Developer
Suneel Pervez Founder, FirstlinkAI | Automation Specialist & Full-Stack Engineer

This project is a live case study of how FirstlinkAI bridges the gap between high-end automation and local business infrastructure.

© 2026 FirstlinkAI | Built for the shores of Palawan.
