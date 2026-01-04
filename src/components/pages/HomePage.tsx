// HPI 1.6-V
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BaseCrudService } from '@/integrations';
import {
  ProfessionalExperience,
  TechnicalSkills,
  CurrentProjects,
  ProfessionalAspirations,
} from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  ChevronDown, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Github, 
  Linkedin, 
  Twitter, 
  ExternalLink,
  Code2,
  Terminal,
  Cpu
} from 'lucide-react';

// --- Mandatory Animated Component ---
type AnimatedElementProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className, delay = 0 }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                // Add a small delay via setTimeout if needed, or just let CSS handle it
                setTimeout(() => {
                    element.classList.add('is-visible');
                }, delay);
                observer.unobserve(element);
            }
        }, { threshold: 0.1 });

        observer.observe(element);
        return () => observer.disconnect();
    }, [delay]);

    return <div ref={ref} className={`${className || ''} animate-reveal`}>{children}</div>;
};

// --- Custom Styles for Animations ---
const CustomStyles = () => (
  <style>{`
    .animate-reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
      will-change: opacity, transform;
    }
    .animate-reveal.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .clip-path-slant {
      clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
    }
    
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
  `}</style>
);

export default function HomePage() {
  // --- Canonical Data Sources ---
  const [experiences, setExperiences] = useState<ProfessionalExperience[]>([]);
  const [skills, setSkills] = useState<TechnicalSkills[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<TechnicalSkills[]>([]);
  const [projects, setProjects] = useState<CurrentProjects[]>([]);
  const [aspirations, setAspirations] = useState<ProfessionalAspirations[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Skills');
  const [categories, setCategories] = useState<string[]>(['All Skills']);

  // --- Scroll Hooks for Parallax ---
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  
  // --- Data Fetching ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { items: expItems } = await BaseCrudService.getAll<ProfessionalExperience>('professionalexperience');
    const { items: skillItems } = await BaseCrudService.getAll<TechnicalSkills>('technicalskills');
    const { items: projectItems } = await BaseCrudService.getAll<CurrentProjects>('currentprojects');
    const { items: aspirationItems } = await BaseCrudService.getAll<ProfessionalAspirations>('professionalaspirations');

    // Sort experiences by start date (most recent first)
    const sortedExp = expItems.sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA;
    });

    // Sort skills by display order
    const sortedSkills = skillItems.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    // Sort aspirations by priority order
    const sortedAspirations = aspirationItems.sort(
      (a, b) => (a.priorityOrder || 0) - (b.priorityOrder || 0)
    );

    setExperiences(sortedExp);
    setSkills(sortedSkills);
    setFilteredSkills(sortedSkills);
    setProjects(projectItems);
    setAspirations(sortedAspirations);

    // Extract unique categories
    const uniqueCategories = Array.from(
      new Set(skillItems.map((skill) => skill.category).filter(Boolean))
    ) as string[];
    setCategories(['All Skills', ...uniqueCategories]);
  };

  const filterSkills = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All Skills') {
      setFilteredSkills(skills);
    } else {
      setFilteredSkills(skills.filter((skill) => skill.category === category));
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-beige text-foreground font-paragraph selection:bg-primary selection:text-primary-foreground overflow-clip">
      <CustomStyles />
      
      {/* Sticky Header Wrapper */}
      <div className="sticky top-0 z-50 w-full bg-beige/80 backdrop-blur-md border-b border-foreground/5">
        <Header />
      </div>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative min-h-[95vh] flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-soft-green/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-muted-orange/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-[100rem] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">
          {/* Left Column: Text Content */}
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="lg:col-span-7 space-y-8"
          >
            <AnimatedElement>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-foreground/10 backdrop-blur-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-heading font-medium tracking-wide text-foreground/80">AVAILABLE FOR HIRE</span>
              </div>
            </AnimatedElement>

            <AnimatedElement delay={100}>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-foreground leading-[0.9] tracking-tight">
                MAURICE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">LIPSCHITZ</span>
              </h1>
            </AnimatedElement>

            <AnimatedElement delay={200}>
              <p className="text-xl md:text-2xl font-paragraph text-foreground/80 max-w-2xl leading-relaxed">
                A founder and project developer crafting exceptional experiences in the real world and in the digital world.
              </p>
            </AnimatedElement>

            <AnimatedElement delay={300}>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  onClick={() => scrollToSection('projects')}
                  className="bg-foreground text-beige hover:bg-foreground/90 rounded-full px-8 py-7 text-lg font-heading transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  View My Work
                </Button>
                <Button
                  onClick={() => scrollToSection('contact')}
                  variant="outline"
                  className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-beige rounded-full px-8 py-7 text-lg font-heading transition-all hover:scale-105 bg-transparent"
                >
                  Get In Touch
                </Button>
              </div>
            </AnimatedElement>
            
            <AnimatedElement delay={400}>
               <div className="flex items-center gap-6 pt-8 text-foreground/60">
                  <a href="#" className="hover:text-primary transition-colors"><Github className="w-6 h-6" /></a>
                  <a href="#" className="hover:text-primary transition-colors"><Linkedin className="w-6 h-6" /></a>
                  <a href="#" className="hover:text-primary transition-colors"><Twitter className="w-6 h-6" /></a>
               </div>
            </AnimatedElement>
          </motion.div>

          {/* Right Column: Image & Code Snippet */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative z-10"
            >
              <div className="relative w-[350px] h-[450px] md:w-[450px] md:h-[550px]">
                {/* Abstract Shapes behind image */}
                <div className="absolute -top-6 -left-6 w-full h-full border-2 border-primary rounded-[2.5rem] z-0" />
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-muted-orange/30 rounded-[2.5rem] z-0" />
                
                <Image
                  src="https://static.wixstatic.com/media/d0682b_7cf533a6a4d348a5901a173f1ef9996b~mv2.png"
                  alt="Maurice Lipschitz"
                  className="w-full h-full object-cover rounded-[2rem] shadow-2xl relative z-10"
                  width={500}
                />

                {/* Floating Code Card */}
                <motion.div
                  initial={{ opacity: 0, y: 40, x: 40 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="absolute -bottom-12 -left-12 md:bottom-12 md:-left-24 bg-[#1e1e1e] text-white p-6 rounded-2xl shadow-2xl max-w-[280px] z-20 border border-white/10"
                >
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <pre className="font-mono text-xs leading-relaxed">
                    <span className="text-purple-400">const</span> <span className="text-blue-400">developer</span> = {'{'}
                    {'\n'}  name: <span className="text-green-400">'maurice'</span>,
                    {'\n'}  passion: <span className="text-green-400">'building'</span>,
                    {'\n'}  expertise: <span className="text-green-400">'doing things'</span>
                    {'\n'}{'}'};
                  </pre>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={() => scrollToSection('experience')}
        >
          <ChevronDown className="w-8 h-8 text-foreground/40" />
        </motion.div>
      </section>

      {/* --- PROFESSIONAL EXPERIENCE (Timeline) --- */}
      <section id="experience" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-[100rem] mx-auto">
          <AnimatedElement className="mb-20 text-center">
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6">
              Professional Experience
            </h2>
            <div className="w-24 h-2 bg-primary mx-auto rounded-full" />
          </AnimatedElement>

          <div className="relative">
            {/* Central Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-foreground/20 md:-translate-x-1/2 ml-8 md:ml-0" />

            <div className="space-y-16 md:space-y-24">
              {experiences.map((exp, index) => (
                <div key={exp._id} className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${index % 2 === 0 ? '' : 'md:text-right'}`}>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-1/2 top-0 w-16 h-16 flex items-center justify-center md:-translate-x-1/2 ml-0 md:ml-0 z-10">
                     <div className="w-4 h-4 bg-muted-orange rounded-full border-4 border-beige shadow-lg relative z-10" />
                     <div className="absolute inset-0 bg-muted-orange/20 rounded-full animate-ping opacity-20" />
                  </div>

                  {/* Left Side (Date for Even, Content for Odd) */}
                  <div className={`pl-20 md:pl-0 ${index % 2 === 0 ? 'md:order-1 md:pr-16 md:text-right' : 'md:order-2 md:pl-16 md:text-left'}`}>
                    {index % 2 === 0 ? (
                      <AnimatedElement>
                        <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-foreground/5 group">
                          <div className="flex flex-col gap-2">
                            <span className="text-primary font-heading font-bold tracking-wider text-sm uppercase">
                              {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                            </span>
                            <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                              {exp.jobTitle}
                            </h3>
                            <p className="text-lg font-medium text-foreground/70">{exp.companyName}</p>
                            <p className="text-foreground/60 leading-relaxed mt-4">{exp.description}</p>
                          </div>
                        </div>
                      </AnimatedElement>
                    ) : (
                      <AnimatedElement delay={200}>
                         <div className="hidden md:block text-foreground/40 font-heading text-xl font-bold">
                            {formatDate(exp.startDate).split(' ')[1]}
                         </div>
                      </AnimatedElement>
                    )}
                  </div>

                  {/* Right Side (Content for Even, Date for Odd) */}
                  <div className={`pl-20 md:pl-0 ${index % 2 === 0 ? 'md:order-2 md:pl-16 md:text-left' : 'md:order-1 md:pr-16 md:text-right'}`}>
                    {index % 2 !== 0 ? (
                      <AnimatedElement>
                        <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-foreground/5 group">
                          <div className="flex flex-col gap-2">
                            <span className="text-primary font-heading font-bold tracking-wider text-sm uppercase">
                              {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                            </span>
                            <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                              {exp.jobTitle}
                            </h3>
                            <p className="text-lg font-medium text-foreground/70">{exp.companyName}</p>
                            <p className="text-foreground/60 leading-relaxed mt-4">{exp.description}</p>
                          </div>
                        </div>
                      </AnimatedElement>
                    ) : (
                       <AnimatedElement delay={200}>
                         <div className="hidden md:block text-foreground/40 font-heading text-xl font-bold">
                            {formatDate(exp.startDate).split(' ')[1]}
                         </div>
                      </AnimatedElement>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- TECHNICAL SKILLS --- */}
      <section id="skills" className="py-32 px-6 bg-white rounded-t-[4rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)] relative z-20">
        <div className="max-w-[100rem] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <AnimatedElement>
              <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground">
                Technical Skills <br />
                <span className="text-primary">& Expertise</span>
              </h2>
            </AnimatedElement>
            
            <AnimatedElement delay={200}>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => filterSkills(category)}
                    className={`px-6 py-3 rounded-full text-sm font-heading font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-foreground text-white shadow-lg scale-105'
                        : 'bg-beige text-foreground hover:bg-foreground/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </AnimatedElement>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredSkills.map((skill) => (
                <motion.div
                  layout
                  key={skill._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-beige rounded-3xl p-8 hover:shadow-lg transition-shadow border border-foreground/5"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <Code2 className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-heading font-bold text-2xl text-foreground/20">
                      {skill.proficiencyLevel}%
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">{skill.skillName}</h3>
                  <p className="text-sm text-foreground/60 mb-6 min-h-[3rem]">{skill.description || "Proficient in utilizing this technology for production-grade applications."}</p>
                  
                  <div className="h-3 bg-white rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiencyLevel}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- CURRENT PROJECTS --- */}
      <section id="projects" className="py-32 px-6 bg-beige">
        <div className="max-w-[100rem] mx-auto">
          <AnimatedElement className="mb-20">
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6">
              Selected Works
            </h2>
            <p className="text-xl text-foreground/60 max-w-2xl">
              A collection of projects that showcase my passion for building products that solve real problems.
            </p>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, index) => (
              <AnimatedElement key={project._id} delay={index * 100}>
                <div className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-72 overflow-hidden">
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors z-10" />
                    {project.projectImage ? (
                      <Image
                        src={project.projectImage}
                        alt={project.projectName || 'Project'}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        width={600}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Terminal className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Floating Category Badge */}
                    <div className="absolute top-6 left-6 z-20">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-heading font-bold text-foreground shadow-sm">
                        {project.projectCategory || 'Development'}
                      </span>
                    </div>

                    {/* Action Button Overlay */}
                    <div className="absolute bottom-6 right-6 z-20 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <a 
                        href={project.projectLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary/90"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {project.projectName}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed mb-6 flex-1">
                      {project.projectDescription}
                    </p>
                    <div className="pt-6 border-t border-foreground/5 flex items-center text-sm font-heading font-bold text-foreground/40 group-hover:text-foreground/80 transition-colors">
                      VIEW CASE STUDY <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROFESSIONAL ASPIRATIONS --- */}
      <section id="aspirations" className="py-32 px-6 bg-foreground text-beige rounded-[3rem] mx-4 md:mx-8 mb-8">
        <div className="max-w-[100rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <AnimatedElement>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8">
                  Future <br />
                  <span className="text-muted-orange">Aspirations</span>
                </h2>
                <p className="text-white/60 text-lg leading-relaxed mb-8">
                  I am constantly looking forward, setting new goals, and pushing the boundaries of what's possible in tech and design.
                </p>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white hover:text-foreground rounded-full px-8 py-6"
                >
                  Read My Blog
                </Button>
              </AnimatedElement>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {aspirations.slice(0, 3).map((aspiration, index) => (
                <AnimatedElement key={aspiration._id} delay={index * 100} className={index === 2 ? "md:col-span-2" : ""}>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors h-full">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 bg-muted-orange/20 rounded-xl">
                        <Cpu className="w-6 h-6 text-muted-orange" />
                      </div>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-white/60">
                        {aspiration.status || 'In Progress'}
                      </span>
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white mb-3">
                      {aspiration.goalTitle}
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      {aspiration.goalDescription}
                    </p>
                  </div>
                </AnimatedElement>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- GET IN TOUCH --- */}
      <section id="contact" className="py-32 px-6 bg-white">
        <div className="max-w-[100rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Info */}
            <AnimatedElement>
              <h2 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-8">
                Let's work <br />
                <span className="text-primary">together.</span>
              </h2>
              <p className="text-xl text-foreground/70 mb-12 max-w-md">
                Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-16 h-16 bg-beige rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-heading font-bold text-foreground/40 mb-1">EMAIL ME</p>
                    <p className="text-xl font-medium text-foreground">maurice@example.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-16 h-16 bg-beige rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-heading font-bold text-foreground/40 mb-1">CALL ME</p>
                    <p className="text-xl font-medium text-foreground">+1 (234) 567-890</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-16 h-16 bg-beige rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-heading font-bold text-foreground/40 mb-1">LOCATED IN</p>
                    <p className="text-xl font-medium text-foreground">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>

            {/* Contact Form */}
            <AnimatedElement delay={200}>
              <div className="bg-beige p-10 md:p-12 rounded-[3rem] shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-soft-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <form className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-heading font-bold text-foreground ml-4">NAME</label>
                      <Input placeholder="John Doe" className="bg-white border-none h-14 rounded-2xl px-6 shadow-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-heading font-bold text-foreground ml-4">EMAIL</label>
                      <Input placeholder="john@example.com" type="email" className="bg-white border-none h-14 rounded-2xl px-6 shadow-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-heading font-bold text-foreground ml-4">SUBJECT</label>
                    <Input placeholder="Project Inquiry" className="bg-white border-none h-14 rounded-2xl px-6 shadow-sm focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-heading font-bold text-foreground ml-4">MESSAGE</label>
                    <Textarea placeholder="Tell me about your project..." className="bg-white border-none min-h-[150px] rounded-2xl p-6 shadow-sm resize-none focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <Button className="w-full h-16 bg-foreground text-white hover:bg-foreground/90 rounded-2xl text-lg font-heading font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 mt-4">
                    Send Message
                  </Button>
                </form>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}