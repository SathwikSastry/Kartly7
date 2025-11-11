import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

/**
 * Footer - Glassmorphic footer with social links and brand info
 * Features subtle hover glow effects on social icons
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Mail, href: "mailto:hello@kartly7.com", label: "Email" },
  ];

  return (
    <footer className="py-12 px-4 border-t border-border/30 mt-24">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="text-2xl font-heading font-bold text-gradient-cosmic mb-2">
              KARTLY7
            </h3>
            <p className="text-muted-foreground">
              Useful Products. Remarkable Experiences.
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex gap-4"
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1 }}
                className="glass p-3 rounded-full hover:glow-cyan transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 text-primary" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 pt-8 border-t border-border/30 text-center text-muted-foreground text-sm"
        >
          © {currentYear} Kartly7. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
};
