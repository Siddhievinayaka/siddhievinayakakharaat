import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Experience', id: 'experience' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Aspirations', id: 'aspirations' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <header className="w-full">
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <nav className="flex justify-between items-center">
            <Link to="/" className="text-xl sm:text-2xl font-heading font-bold text-foreground">
              ML
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6 lg:gap-8 items-center">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm lg:text-base font-paragraph text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-beige/95 backdrop-blur-sm z-40">
          <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-left px-4 py-3 text-base font-paragraph text-foreground hover:bg-foreground/5 hover:text-primary transition-colors rounded-lg"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
