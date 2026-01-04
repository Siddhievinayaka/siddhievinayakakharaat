import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-beige/95 backdrop-blur-sm shadow-md' : 'bg-beige'
      }`}
    >
      <div className="max-w-[120rem] mx-auto px-8 py-6">
        <nav className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-heading font-bold text-foreground">
            ML
          </Link>
          <div className="flex gap-8 items-center">
            <button
              onClick={() => scrollToSection('home')}
              className="text-base font-paragraph text-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className="text-base font-paragraph text-foreground hover:text-primary transition-colors"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="text-base font-paragraph text-foreground hover:text-primary transition-colors"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="text-base font-paragraph text-foreground hover:text-primary transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('aspirations')}
              className="text-base font-paragraph text-foreground hover:text-primary transition-colors"
            >
              Aspirations
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-base font-paragraph text-foreground hover:text-primary transition-colors"
            >
              Contact
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
