import { Building2, Users, Shield } from "lucide-react";
import { RichContent } from "@/components/RichContent";
import type { AboutContent, AboutFeatureIcon } from "@/lib/cms";

const featureIcons: Record<AboutFeatureIcon, typeof Building2> = {
  building2: Building2,
  users: Users,
  shield: Shield,
  award: Shield,
};

type AboutSectionProps = {
  content: AboutContent;
};

export const AboutSection = ({ content }: AboutSectionProps) => {
  return (
    <section id="about" className="py-12 md:py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 animate-fade-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            {content.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            {content.title1} <span className="text-primary">{content.title2}</span>
          </h2>
        </div>

        {/* Main Content */}
        <div className="animate-fade-up mb-8">
          <RichContent
            html={content.description}
            className="mx-auto mb-8 max-w-4xl text-center text-sm leading-relaxed text-muted-foreground"
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            {content.stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-card border border-border">
                <span className="text-2xl md:text-3xl font-heading font-bold text-secondary">{stat.value}</span>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Image Gallery - 4 equal photos horizontally */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {content.gallery.map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-32 md:h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section with light red background */}
      <div className="bg-destructive/10 py-10 mt-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.features.map((feature, index) => {
              const Icon = featureIcons[feature.icon] ?? Shield;

              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-xl bg-card/80 backdrop-blur border border-destructive/20 hover:border-destructive/40 text-center transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 mx-auto rounded-lg bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive transition-all duration-300">
                    <Icon className="w-6 h-6 text-destructive group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-base font-heading font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <RichContent
                    html={feature.description}
                    className="text-sm leading-relaxed text-muted-foreground"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
