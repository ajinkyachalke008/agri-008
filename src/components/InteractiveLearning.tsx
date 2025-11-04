import { useState } from "react";
import { PlayCircle, MessageSquare, Users, Play, Send, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Import images
import irrigationTechniques from "@/assets/irrigation-techniques.jpg";
import safePesticideSpraying from "@/assets/safe-pesticide-spraying.jpg";
import cropSelection from "@/assets/crop-selection.jpg";
import equipmentHandling from "@/assets/equipment-handling.jpg";
import organicFarming from "@/assets/organic-farming.jpg";
import yellowingTomatoLeaves from "@/assets/yellowing-tomato-leaves.jpg";
import wheatField from "@/assets/wheat-field.jpg";
import riceCropInspection from "@/assets/rice-crop-inspection.jpg";
import soilInHands from "@/assets/soil-in-hands.jpg";
import sprinklerIrrigation from "@/assets/sprinkler-irrigation.jpg";
import cropPlanningCalendar from "@/assets/crop-planning-calendar.jpg";
import expertConsultation from "@/assets/expert-consultation.jpg";
import expertMeera from "@/assets/expert-meera.jpg";
import expertRaj from "@/assets/expert-raj.jpg";
import expertKavita from "@/assets/expert-kavita.jpg";

const InteractiveLearning = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const videoTutorials = [
    {
      title: "Irrigation Techniques",
      description: "Learn modern drip irrigation methods",
      thumbnail: irrigationTechniques,
      duration: "12:30"
    },
    {
      title: "Safe Pesticide Spraying",
      description: "Protective gear and application techniques",
      thumbnail: safePesticideSpraying,
      duration: "8:45"
    },
    {
      title: "Choosing Right Crop",
      description: "Selection based on soil and climate",
      thumbnail: cropSelection,
      duration: "15:20"
    },
    {
      title: "Equipment Handling",
      description: "Tractor and seed drill operation",
      thumbnail: equipmentHandling,
      duration: "18:15"
    },
    {
      title: "Organic Farming Practices",
      description: "Chemical-free cultivation methods",
      thumbnail: organicFarming,
      duration: "22:10"
    }
  ];

  const qnaData = [
    {
      question: "Why do tomato leaves turn yellow?",
      answer: "Nitrogen deficiency. Add compost or organic fertilizer.",
      image: yellowingTomatoLeaves,
      author: "Dr. Meera Sharma",
      likes: 45
    },
    {
      question: "Best sowing time for wheat in Rajasthan?",
      answer: "Mid-November is ideal for wheat sowing in Rajasthan.",
      image: wheatField,
      author: "Dr. Raj Patel",
      likes: 32
    },
    {
      question: "How to protect rice crops from pests?",
      answer: "Use neem-based pesticides and maintain proper water levels.",
      image: riceCropInspection,
      author: "Agricultural Expert",
      likes: 28
    }
  ];

  const upcomingWebinars = [
    {
      title: "Soil Health Management",
      date: "Oct 15, 2024",
      time: "2:00 PM",
      image: soilInHands,
      expert: "Dr. Meera Sharma"
    },
    {
      title: "Smart Irrigation",
      date: "Oct 20, 2024",
      time: "3:00 PM",
      image: sprinklerIrrigation,
      expert: "Dr. Kavita Joshi"
    },
    {
      title: "Crop Planning Workshop",
      date: "Oct 25, 2024",
      time: "10:00 AM",
      image: cropPlanningCalendar,
      expert: "Dr. Raj Patel"
    }
  ];

  const experts = [
    {
      name: "Dr. Meera Sharma",
      specialization: "Soil Specialist",
      bio: "15+ years experience in soil health and nutrition management.",
      image: expertMeera,
      rating: 4.9
    },
    {
      name: "Dr. Raj Patel",
      specialization: "Crop Scientist",
      bio: "Expert in crop planning and yield optimization techniques.",
      image: expertRaj,
      rating: 4.8
    },
    {
      name: "Dr. Kavita Joshi",
      specialization: "Irrigation Expert",
      bio: "Specialist in water management and irrigation systems.",
      image: expertKavita,
      rating: 4.9
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-background via-muted/10 to-background relative">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className="font-cyber neon-text">Learn & Grow</span>{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Together
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our thriving community of farmers, experts, and agricultural enthusiasts. 
            Learn new techniques, share knowledge, and grow together.
          </p>
        </div>

        {/* Interactive Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Video Tutorials Card */}
          <Collapsible open={expandedCard === "videos"} onOpenChange={() => toggleCard("videos")}>
            <Card className="cyber-card h-fit group border-2 border-primary/20 hover:border-primary/40">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 glow-green group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  🌾 Video Tutorials 🎥
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Step-by-step agricultural training in local languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CollapsibleTrigger asChild>
                  <Button variant="hero" className="w-full mb-4">
                    Explore Video Tutorials
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 animate-accordion-down">
                  <div className="grid gap-4">
                    {videoTutorials.map((video, index) => (
                      <div key={index} className="glass-feature rounded-lg p-3 hover:bg-muted/20 transition-colors">
                        <div className="flex gap-3">
                          <div className="relative">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title}
                              className="w-20 h-14 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="w-6 h-6 text-white drop-shadow-lg" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground text-sm">{video.title}</h4>
                            <p className="text-xs text-muted-foreground">{video.description}</p>
                            <span className="text-xs text-primary">{video.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </CardContent>
            </Card>
          </Collapsible>

          {/* Q&A Forum Card */}
          <Collapsible open={expandedCard === "forum"} onOpenChange={() => toggleCard("forum")}>
            <Card className="glass-feature h-fit group hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4 glow-blue group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  💬 Q&A Forum
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Connect with fellow farmers and experts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CollapsibleTrigger asChild>
                  <Button variant="farm" className="w-full mb-4">
                    Explore Q&A Forum
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 animate-accordion-down">
                  <div className="space-y-4">
                    {qnaData.map((qa, index) => (
                      <div key={index} className="glass-feature rounded-lg p-4">
                        <div className="flex gap-3">
                          <img 
                            src={qa.image} 
                            alt="Q&A related"
                            className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm mb-2">Q: {qa.question}</p>
                            <p className="text-xs text-muted-foreground mb-2">A: {qa.answer}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>by {qa.author}</span>
                              <span>❤️ {qa.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="glass" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Post Your Question
                    </Button>
                  </div>
                </CollapsibleContent>
              </CardContent>
            </Card>
          </Collapsible>

          {/* Expert Sessions Card */}
          <Collapsible open={expandedCard === "experts"} onOpenChange={() => toggleCard("experts")}>
            <Card className="glass-feature h-fit group hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 glow-yellow group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  👨‍🌾 Expert Sessions
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Live sessions with agricultural scientists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CollapsibleTrigger asChild>
                  <Button variant="glass" className="w-full mb-4">
                    Explore Expert Sessions
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 animate-accordion-down">
                  {/* Upcoming Webinars */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Upcoming Webinars</h4>
                    <div className="space-y-3">
                      {upcomingWebinars.map((webinar, index) => (
                        <div key={index} className="glass-feature rounded-lg p-3">
                          <div className="flex gap-3">
                            <img 
                              src={webinar.image} 
                              alt={webinar.title}
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-foreground text-sm">{webinar.title}</h5>
                              <p className="text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                {webinar.date} at {webinar.time}
                              </p>
                              <p className="text-xs text-primary">by {webinar.expert}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Consultation Form */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">One-on-One Consultation</h4>
                    <div className="glass-feature rounded-lg p-4 space-y-3">
                      <img 
                        src={expertConsultation} 
                        alt="Expert giving advice"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="name" className="text-xs">Name</Label>
                          <Input id="name" placeholder="Your name" className="h-8 text-xs" />
                        </div>
                        <div>
                          <Label htmlFor="crop" className="text-xs">Crop Type</Label>
                          <Input id="crop" placeholder="e.g., Wheat, Rice" className="h-8 text-xs" />
                        </div>
                        <Button variant="hero" size="sm" className="w-full">
                          Book Consultation
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expert Profiles */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Our Experts</h4>
                    <div className="grid gap-3">
                      {experts.map((expert, index) => (
                        <div key={index} className="glass-feature rounded-lg p-3">
                          <div className="flex gap-3">
                            <img 
                              src={expert.image} 
                              alt={expert.name}
                              className="w-12 h-12 object-cover rounded-full flex-shrink-0"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-foreground text-sm">{expert.name}</h5>
                              <p className="text-xs text-primary">{expert.specialization}</p>
                              <p className="text-xs text-muted-foreground">{expert.bio}</p>
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-yellow-500">⭐ {expert.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </CardContent>
            </Card>
          </Collapsible>
        </div>

        {/* Community Stats */}
        <div className="glass-hero mt-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Growing Knowledge Community
            </h3>
            <p className="text-lg text-muted-foreground">
              Empowering farmers with education and peer support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <PlayCircle className="w-8 h-8 text-primary mr-3" />
                <span className="text-4xl font-bold text-primary">500+</span>
              </div>
              <p className="text-muted-foreground font-medium">Training Modules</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-primary mr-3" />
                <span className="text-4xl font-bold text-primary">95%</span>
              </div>
              <p className="text-muted-foreground font-medium">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-primary mr-3" />
                <span className="text-4xl font-bold text-primary">12</span>
              </div>
              <p className="text-muted-foreground font-medium">Languages Supported</p>
            </div>
          </div>

          <div className="text-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Join Our Community
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveLearning;