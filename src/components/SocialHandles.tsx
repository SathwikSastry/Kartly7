import { motion } from "framer-motion";
import { GlassCard } from "./ui/glass-card";
import { Instagram } from "lucide-react";

/**
 * SocialHandles - Section displaying social media links
 * Features glassmorphic card with animated social icons
 */
export const SocialHandles = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Connect With <span className="text-gradient-cosmic">Us</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow us on social media for the latest updates, exclusive offers, and behind-the-scenes content.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <GlassCard strong glow="magenta" className="max-w-md w-full">
            <div className="flex flex-col items-center text-center space-y-6 py-8">
              <motion.a
                href="https://www.instagram.com/kartly_7/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-4 p-6 glass-strong rounded-xl w-full group transition-all hover:glow-magenta"
              >
                <div className="p-4 rounded-full glass-strong glow-magenta group-hover:scale-110 transition-transform">
                  <Instagram className="w-8 h-8 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-heading font-semibold text-gradient-cosmic mb-1">
                    Instagram
                  </h3>
                  <p className="text-muted-foreground">@kartly_7</p>
                </div>
              </motion.a>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
