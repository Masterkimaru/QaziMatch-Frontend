"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Image from 'next/image';
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Get user initials from name
  const getUserInitials = (name: string | undefined, email: string): string => {
    const source = name || email.split('@')[0] || 'User';
    return source
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-mobile-menu-button]')) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo and Brand */}
            <Link 
              href="/" 
              className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <Image
                    src="/Qazi-logo.png"
                    alt="Logo"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent hover:from-accent hover:via-primary hover:to-accent transition-all duration-500">
                QaziMatch
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Jobs Link - Always visible */}
              <Link 
                href="/jobs"
                className="relative text-foreground hover:text-primary cursor-pointer transition-all duration-300 font-medium group flex items-center space-x-2"
                onMouseEnter={() => setHoveredItem('jobs')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2zm-8 0V8a2 2 0 00-2 2H4a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
                <span>Jobs</span>
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-primary transition-all duration-300 ${
                  hoveredItem === 'jobs' ? 'w-full' : 'w-0'
                }`} />
              </Link>

              {/* Resume Optimization - Available for employees and public users, but NOT employers */}
              {(user?.role === 'EMPLOYEE' || !user) && (
                <Link 
                  href="/Resume-optimization"
                  className="relative text-foreground hover:text-primary cursor-pointer transition-all duration-300 font-medium group flex items-center space-x-2"
                  onMouseEnter={() => setHoveredItem('resumeOptimization')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Resume Optimization</span>
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-primary transition-all duration-300 ${
                    hoveredItem === 'resumeOptimization' ? 'w-full' : 'w-0'
                  }`} />
                </Link>
              )}

              {/* Role-based navigation - Employer */}
              {user?.role === 'EMPLOYER' && (
                <>
                  <Link 
                    href="/talent-sourcing"
                    className="relative text-foreground hover:text-primary cursor-pointer transition-all duration-300 font-medium group flex items-center space-x-2"
                    onMouseEnter={() => setHoveredItem('talentSourcing')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Talent Sourcing</span>
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-primary transition-all duration-300 ${
                      hoveredItem === 'talentSourcing' ? 'w-full' : 'w-0'
                    }`} />
                  </Link>

                  <Link 
                    href="/jobs/create"
                    className="relative text-foreground hover:text-primary cursor-pointer transition-all duration-300 font-medium group flex items-center space-x-2"
                    onMouseEnter={() => setHoveredItem('postJob')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Post Job</span>
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-primary transition-all duration-300 ${
                      hoveredItem === 'postJob' ? 'w-full' : 'w-0'
                    }`} />
                  </Link>

                  <Link 
                    href="/Employer-View-Application"
                    className="relative text-foreground hover:text-primary cursor-pointer transition-all duration-300 font-medium group flex items-center space-x-2"
                    onMouseEnter={() => setHoveredItem('applications')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span>Applications</span>
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-primary transition-all duration-300 ${
                      hoveredItem === 'applications' ? 'w-full' : 'w-0'
                    }`} />
                  </Link>

                  <Link 
                    href="/jobs/my"
                    className="relative text-foreground hover:text-primary cursor-pointer transition-all duration-300 font-medium group flex items-center space-x-2"
                    onMouseEnter={() => setHoveredItem('myJobs')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>My Jobs</span>
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-primary transition-all duration-300 ${
                      hoveredItem === 'myJobs' ? 'w-full' : 'w-0'
                    }`} />
                  </Link>
                </>
              )}

              {/* Role-based navigation - Employee */}
              {user?.role === 'EMPLOYEE' && (
                <Link 
                  href="/my-applications"
                  className="relative text-foreground hover:text-primary cursor-pointer transition-all duration-300 font-medium group flex items-center space-x-2"
                  onMouseEnter={() => setHoveredItem('myApplications')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4" />
                  </svg>
                  <span>My Applications</span>
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-primary transition-all duration-300 ${
                    hoveredItem === 'myApplications' ? 'w-full' : 'w-0'
                  }`} />
                </Link>
              )}

              {/* Auth Section - Desktop */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
                      {getUserInitials(user.name, user.email)}
                    </div>
                    <svg 
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {getUserInitials(user.name, user.email)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Welcome, {user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role?.toLowerCase()}</p>
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profile</span>
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="relative bg-gradient-primary text-primary-foreground px-6 py-2 rounded-lg cursor-pointer font-medium overflow-hidden group border-animate hover:shadow-md transition-all duration-300 flex items-center space-x-2"
                  onMouseEnter={() => setHoveredItem('login')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="relative z-10">Login</span>
                  <div className={`absolute inset-0 bg-white/10 transform origin-left transition-transform duration-300 ${
                    hoveredItem === 'login' ? 'scale-x-100' : 'scale-x-0'
                  }`} />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button and User Avatar */}
            <div className="flex lg:hidden items-center space-x-3">
              {user && (
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
                  {getUserInitials(user.name, user.email)}
                </div>
              )}
              
              {/* Hamburger Menu Button */}
              <button
                data-mobile-menu-button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/20"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`block h-0.5 bg-foreground rounded transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}></span>
                  <span className={`block h-0.5 bg-foreground rounded transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}></span>
                  <span className={`block h-0.5 bg-foreground rounded transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 z-[60] ${
          isMobileMenuOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible'
        }`}
        onClick={closeMobileMenu}
      >
        {/* Mobile Menu Panel */}
        <div 
          ref={mobileMenuRef}
          className={`bg-background/95 backdrop-blur-md border-l border-border h-full w-80 max-w-[85%] ml-auto shadow-2xl transform transition-all duration-300 ease-in-out overflow-y-auto ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* User Info Section - Mobile */}
          {user && (
            <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white text-base font-semibold shadow-md">
                  {getUserInitials(user.name, user.email)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role?.toLowerCase()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <div className="py-2">
            {/* Jobs Link - Always visible with fade animation */}
            <div 
              className={`transform transition-all duration-300 ${
                isMobileMenuOpen 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-2 opacity-0'
              }`}
              style={{ transitionDelay: '50ms' }}
            >
              <Link 
                href="/jobs"
                className="flex items-center space-x-3 px-6 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                onClick={closeMobileMenu}
              >
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2zm-8 0V8a2 2 0 00-2 2H4a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
                <span className="font-medium">Jobs</span>
              </Link>
            </div>

            {/* Resume Optimization - Conditional visibility with fade animation */}
            {(user?.role === 'EMPLOYEE' || !user) && (
              <div 
                className={`transform transition-all duration-300 ${
                  isMobileMenuOpen 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-2 opacity-0'
                }`}
                style={{ transitionDelay: '100ms' }}
              >
                <Link 
                  href="/Resume-optimization"
                  className="flex items-center space-x-3 px-6 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                  onClick={closeMobileMenu}
                >
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">Resume Optimization</span>
                </Link>
              </div>
            )}

            {/* Employer Links with staggered fade animations */}
            {user?.role === 'EMPLOYER' && (
              <>
                <div 
                  className={`px-6 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider transform transition-all duration-300 ${
                    isMobileMenuOpen 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-2 opacity-0'
                  }`}
                  style={{ transitionDelay: '150ms' }}
                >
                  Employer Tools
                </div>
                
                <div 
                  className={`transform transition-all duration-300 ${
                    isMobileMenuOpen 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-2 opacity-0'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  <Link 
                    href="/talent-sourcing"
                    className="flex items-center space-x-3 px-6 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                    onClick={closeMobileMenu}
                  >
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">Talent Sourcing</span>
                  </Link>
                </div>

                <div 
                  className={`transform transition-all duration-300 ${
                    isMobileMenuOpen 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-2 opacity-0'
                  }`}
                  style={{ transitionDelay: '250ms' }}
                >
                  <Link 
                    href="/jobs/create"
                    className="flex items-center space-x-3 px-6 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                    onClick={closeMobileMenu}
                  >
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="font-medium">Post Job</span>
                  </Link>
                </div>

                <div 
                  className={`transform transition-all duration-300 ${
                    isMobileMenuOpen 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-2 opacity-0'
                  }`}
                  style={{ transitionDelay: '300ms' }}
                >
                  <Link 
                    href="/Employer-View-Application"
                    className="flex items-center space-x-3 px-6 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                    onClick={closeMobileMenu}
                  >
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span className="font-medium">Applications</span>
                  </Link>
                </div>

                <div 
                  className={`transform transition-all duration-300 ${
                    isMobileMenuOpen 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-2 opacity-0'
                  }`}
                  style={{ transitionDelay: '350ms' }}
                >
                  <Link 
                    href="/jobs/my"
                    className="flex items-center space-x-3 px-6 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                    onClick={closeMobileMenu}
                  >
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-medium">My Jobs</span>
                  </Link>
                </div>
              </>
            )}

            {/* Employee Links with fade animations */}
            {user?.role === 'EMPLOYEE' && (
              <>
                <div 
                  className={`px-6 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider transform transition-all duration-300 ${
                    isMobileMenuOpen 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-2 opacity-0'
                  }`}
                  style={{ transitionDelay: '150ms' }}
                >
                  My Activity
                </div>
                
                <div 
                  className={`transform transition-all duration-300 ${
                    isMobileMenuOpen 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-2 opacity-0'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  <Link 
                    href="/my-applications"
                    className="flex items-center space-x-3 px-6 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                    onClick={closeMobileMenu}
                  >
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4" />
                    </svg>
                    <span className="font-medium">My Applications</span>
                  </Link>
                </div>
              </>
            )}

            {/* Divider */}
            {user && (
              <div 
                className={`my-3 border-t border-border transform transition-all duration-300 ${
                  isMobileMenuOpen 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-2 opacity-0'
                }`}
                style={{ transitionDelay: user?.role === 'EMPLOYER' ? '400ms' : '250ms' }}
              />
            )}

            {/* Account Section with fade animations */}
            {user ? (
              <>
                <div 
                  className={`px-6 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider transform transition-all duration-300 ${
                    isMobileMenuOpen 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-2 opacity-0'
                  }`}
                  style={{ transitionDelay: user?.role === 'EMPLOYER' ? '450ms' : '300ms' }}
                >
                  Account
                </div>
                
                <div 
                  className={`transform transition-all duration-300 ${
                    isMobileMenuOpen 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-2 opacity-0'
                  }`}
                  style={{ transitionDelay: user?.role === 'EMPLOYER' ? '500ms' : '350ms' }}
                >
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-6 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                    onClick={closeMobileMenu}
                  >
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">Profile</span>
                  </Link>
                </div>

                <div 
                  className={`transform transition-all duration-300 ${
                    isMobileMenuOpen 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-2 opacity-0'
                  }`}
                  style={{ transitionDelay: user?.role === 'EMPLOYER' ? '550ms' : '400ms' }}
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-6 py-3 text-red-600 hover:bg-red-50/50 hover:text-red-700 transition-all duration-200 w-full text-left group"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div 
                className={`px-6 py-4 transform transition-all duration-300 ${
                  isMobileMenuOpen 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-2 opacity-0'
                }`}
                style={{ transitionDelay: '150ms' }}
              >
                <Link 
                  href="/login" 
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 hover:shadow-lg transition-all duration-300"
                  onClick={closeMobileMenu}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}