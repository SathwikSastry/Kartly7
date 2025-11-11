import { motion } from "framer-motion";
import { GlassCard } from "./ui/glass-card";
import { Sparkles, Heart, Zap } from "lucide-react";

/**
 * WhyKartly7 - Brand mission section with tilted glass cards
 * Explains the core values: Quality, Experience, and Innovation
 */
export const WhyKartly7 = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Every product is meticulously crafted with attention to detail, ensuring excellence in design and functionality.",
      glow: "cyan" as const,
    },
    {
      icon: Heart,
      title: "Memorable Experiences",
      description: "We don't just sell products—we create moments that enhance your lifestyle and bring joy to everyday rituals.",
      glow: "purple" as const,
    },
    {
      icon: Zap,
      title: "Innovation First",
      description: "Combining cutting-edge design with practical utility, delivering products that are both beautiful and useful.",
      glow: "magenta" as const,
    },
  ];

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
            Why Choose <span className="text-gradient-cosmic">Kartly7</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're redefining e-commerce with a focus on quality, experience, and innovation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <GlassCard tilt glow={feature.glow} className="h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full glass-strong glow-${feature.glow}`}>
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-heading font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
