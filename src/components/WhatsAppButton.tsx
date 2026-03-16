import { MessageCircle } from "lucide-react";
import type { ContactContent } from "@/lib/cms";

type WhatsAppButtonProps = {
  contact: ContactContent;
};

export const WhatsAppButton = ({ contact }: WhatsAppButtonProps) => {
  return (
    <a
      href={`https://wa.me/${contact.phone.replace(/[\s+]/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};
