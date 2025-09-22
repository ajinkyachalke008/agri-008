import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactCTA = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    farmSize: "",
    message: ""
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for your interest!",
      description: "We'll contact you soon to discuss your Smart Farm Advisory needs.",
    });
    setFormData({ name: "", email: "", phone: "", farmSize: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Ready to Transform{" "}
            <span className="text-primary bg-gradient-to-r from-farm-green to-sky-blue bg-clip-text text-transparent">
              Your Farm?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of farmers who are already using smart technology to increase yields, 
            reduce costs, and farm more sustainably.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Contact Form */}
          <div className="glass-hero">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
              Start Your Free Pilot Program
            </h3>
            <p className="text-muted-foreground mb-8">
              Get personalized recommendations for your farm and see the impact of smart agriculture firsthand.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="glass border-glass-border backdrop-blur-sm"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone Number *</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="glass border-glass-border backdrop-blur-sm"
                    placeholder="Your contact number"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address *</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="glass border-glass-border backdrop-blur-sm"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Farm Size (in acres)</label>
                <Input
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleChange}
                  className="glass border-glass-border backdrop-blur-sm"
                  placeholder="e.g., 5 acres"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tell us about your farming needs</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="glass border-glass-border backdrop-blur-sm min-h-[120px]"
                  placeholder="What crops do you grow? What challenges are you facing? How can we help you?"
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full text-lg py-4">
                <Send className="w-5 h-5 mr-2" />
                Start Free Pilot
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                * No commitment required. Cancel anytime during the pilot period.
              </p>
            </form>
          </div>

          {/* Contact Information & Benefits */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="glass-feature">
              <h4 className="text-xl font-semibold text-foreground mb-6">
                Get in Touch
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone Support</p>
                    <p className="text-muted-foreground">+91 9270134411</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email Support</p>
                    <p className="text-muted-foreground">ajinkyachalke008@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Office Location</p>
                    <p className="text-muted-foreground">Government College of Engineering Karad</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pilot Benefits */}
            <div className="glass-feature">
              <h4 className="text-xl font-semibold text-foreground mb-6">
                What You Get in the Pilot
              </h4>
              
              <ul className="space-y-3">
                {[
                  "30-day free access to all features",
                  "Personalized crop recommendations",
                  "Real-time weather and soil insights",
                  "Expert consultation session",
                  "Mobile app with offline capabilities",
                  "24/7 technical support"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Indicators */}
            <div className="glass-feature text-center">
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Trusted by Leading Organizations
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>🏛️ Govt. of India Partner</div>
                <div>🌾 ICAR Collaboration</div>
                <div>🎓 IIT Research Backed</div>
                <div>🏆 AgTech Award Winner</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;