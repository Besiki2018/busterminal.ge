import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react";
import { RichContent } from "@/components/RichContent";
import type { ContactContent } from "@/lib/cms";

type ContactSectionProps = {
  content: ContactContent;
};

export const ContactSection = ({ content }: ContactSectionProps) => {

  return (
    <section id="contact" className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            {content.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            {content.title1}
            <span className="text-primary">{content.title2}</span>
          </h2>
          <RichContent
            html={content.description}
            className="text-lg text-muted-foreground"
          />
        </div>

        {/* Contact Info Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-foreground mb-2">{content.addressLabel}</h3>
            <p className="text-sm text-muted-foreground">{content.addressValue}</p>
            <p className="text-xs text-muted-foreground mt-1">{content.addressNote}</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-foreground mb-2">{content.phoneLabel}</h3>
            <a href={`tel:${content.phone.replace(/\s/g, "")}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {content.phone}
            </a>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-foreground mb-2">{content.emailLabel}</h3>
            <a href={`mailto:${content.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {content.email}
            </a>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-foreground mb-2">{content.hoursLabel}</h3>
            <p className="text-sm text-muted-foreground">{content.terminalLabel}: {content.terminalHours}</p>
            <p className="text-sm text-muted-foreground">{content.infoDeskLabel}: {content.infoDeskHours}</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-center">
          <h3 className="font-heading font-bold text-foreground mb-4">{content.followUsLabel}</h3>
          <div className="flex justify-center gap-3">
            <a
              href={content.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-white hover:bg-primary transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href={content.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-white hover:bg-primary transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
