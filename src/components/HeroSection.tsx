import { MapPin, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RichContent } from "@/components/RichContent";
import { useLanguage } from "@/contexts/LanguageContext";
import type { HeroContent } from "@/lib/cms";
import { buildLocalizedPath } from "@/lib/routing";
import { primaryPagePaths } from "@/lib/site-routes";

type HeroSectionProps = {
  content: HeroContent;
};

export const HeroSection = ({ content }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary blur-3xl" />
      </div>
      
      {/* Geometric Shapes */}
      <div className="absolute top-1/4 right-1/4 w-20 h-20 border border-white/20 rotate-45 animate-pulse-soft" />
      <div className="absolute bottom-1/3 left-1/5 w-16 h-16 border border-white/10 rotate-12" />

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{content.badge}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-tight mb-6">
              {content.title1}
              <span className="block text-primary">{content.title2}</span>
            </h1>
            
            <RichContent
              html={content.description}
              className="mb-8 max-w-lg text-base md:text-lg text-white/80"
            />

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                variant="hero" 
                size="xl" 
                className="group"
                onClick={() => navigate(buildLocalizedPath(language, primaryPagePaths.destinations))}
              >
                {t.hero.viewDestinations}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="hero-outline" 
                size="xl"
                onClick={() => navigate(buildLocalizedPath(language, primaryPagePaths.schedule))}
              >
                {t.hero.checkSchedule}
              </Button>
            </div>

            <a 
              href="https://maps.app.goo.gl/YLpYwpCrfxGdjL8a8" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">{content.location}</span>
            </a>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 lg:pl-12">
            {content.stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors"
              >
                <span className="text-4xl md:text-5xl font-heading font-bold text-white">{stat.value}</span>
                <p className="text-white/80 mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};
