import WhatsAppIcon from "./WhatsAppIcon";

const FloatingWhatsApp = () => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
    <a
      href="https://wa.me/15708078735"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-whatsapp text-white flex items-center justify-center shadow-[0_0_30px_hsl(var(--whatsapp)/0.6)] hover:scale-110 transition-transform animate-pulse-glow"
    >
      <span className="absolute inset-0 rounded-full bg-whatsapp animate-ping opacity-20" />
      <WhatsAppIcon className="w-7 h-7 md:w-8 md:h-8 relative" />
    </a>
  </div>
);

export default FloatingWhatsApp;
