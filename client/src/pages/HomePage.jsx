import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Enhanced animated background with multiple floating elements
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
    {/* Primary floating bubbles */}
    <div className="absolute w-96 h-96 bg-gradient-to-tr from-blue-400 via-cyan-300 to-purple-200 opacity-30 rounded-full blur-3xl left-[-8rem] top-[-8rem] animate-float1" />
    <div className="absolute w-80 h-80 bg-gradient-to-tr from-pink-300 via-blue-200 to-cyan-400 opacity-40 rounded-full blur-3xl right-[-6rem] bottom-[-10rem] animate-float2" />
    <div className="absolute w-64 h-64 bg-gradient-to-tr from-purple-300 via-pink-200 to-blue-300 opacity-25 rounded-full blur-2xl left-1/2 top-1/3 animate-float3" />
    
    {/* Secondary decorative elements */}
    <div className="absolute w-32 h-32 bg-gradient-to-r from-yellow-200 to-orange-200 opacity-20 rounded-full blur-xl right-1/4 top-1/4 animate-pulse" />
    <div className="absolute w-24 h-24 bg-gradient-to-r from-green-200 to-teal-200 opacity-30 rounded-full blur-lg left-1/4 bottom-1/4 animate-bounce" style={{ animationDuration: '3s' }} />
    
    {/* Geometric shapes */}
    <div className="absolute w-16 h-16 bg-blue-300 opacity-20 rotate-45 right-1/3 top-2/3 animate-spin" style={{ animationDuration: '20s' }} />
    <div className="absolute w-12 h-12 bg-purple-300 opacity-25 rounded-full left-2/3 top-1/5 animate-ping" style={{ animationDuration: '4s' }} />
  </div>
);

// Enhanced keyframes and animations
const advancedStyles = `
@keyframes float1 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(1deg); }
  66% { transform: translateY(-15px) rotate(-1deg); }
}
@keyframes float2 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(25px) rotate(2deg); }
}
@keyframes float3 {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-20px) translateX(10px); }
  75% { transform: translateY(10px) translateX(-10px); }
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(60px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0px) scale(1); }
}
@keyframes slideInLeft {
  0% { opacity: 0; transform: translateX(-100px); }
  100% { opacity: 1; transform: translateX(0px); }
}
@keyframes slideInRight {
  0% { opacity: 0; transform: translateX(100px); }
  100% { opacity: 1; transform: translateX(0px); }
}
@keyframes scaleIn {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.3); }
}

.animate-float1 { animation: float1 8s ease-in-out infinite; }
.animate-float2 { animation: float2 10s ease-in-out infinite; }
.animate-float3 { animation: float3 12s ease-in-out infinite; }
.fade-in { animation: fadeInUp 1.2s cubic-bezier(0.4, 0, 0.2, 1) both; }
.slide-in-left { animation: slideInLeft 1s cubic-bezier(0.4, 0, 0.2, 1) both; }
.slide-in-right { animation: slideInRight 1s cubic-bezier(0.4, 0, 0.2, 1) both; }
.scale-in { animation: scaleIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) both; }
.glow-effect { animation: glow 3s ease-in-out infinite; }
.hover-lift { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.hover-lift:hover { transform: translateY(-8px) scale(1.02); }
`;

// Enhanced feature card with more animations
const FeatureCard = ({ icon, title, children, delay, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const animationClass = direction === 'left' ? 'slide-in-left' : 
                        direction === 'right' ? 'slide-in-right' : 'fade-in';
  
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 m-3 flex-1 flex flex-col items-center hover-lift border border-white/20 ${isVisible ? animationClass : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-5xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>{icon}</div>
      <div className="font-bold text-xl mb-3 text-blue-700 text-center">{title}</div>
      <div className="text-gray-600 text-center leading-relaxed">{children}</div>
    </div>
  );
};

// Stats counter component
const StatCounter = ({ number, label, delay }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      let start = 0;
      const end = parseInt(number);
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(counter);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [number, delay]);
  
  return (
    <div className={`text-center ${isVisible ? 'scale-in' : 'opacity-0'}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="text-4xl font-bold text-blue-600 mb-2">{count}+</div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );
};

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
      <style>{advancedStyles}</style>
      <AnimatedBackground />
      
      {/* Interactive cursor effect */}
      <div 
        className="fixed w-6 h-6 bg-blue-400/20 rounded-full pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{ 
          left: mousePosition.x - 12, 
          top: mousePosition.y - 12,
          transform: 'scale(1)'
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-20 lg:py-32">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-8 fade-in leading-tight">
              Ahmedabad
              <br className="md:hidden" />
              <span className="block md:inline"> Career Hub</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed fade-in" style={{ animationDelay: '300ms' }}>
              Your gateway to <span className="font-bold text-blue-600">dream careers</span>, 
              <span className="font-bold text-purple-600"> authentic interviews</span>, and 
              <span className="font-bold text-cyan-600">limitless opportunities</span> in Ahmedabad's thriving job market.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 fade-in" style={{ animationDelay: '600ms' }}>
              <Link
                to="/register"
                className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 glow-effect"
              >
                <span className="relative z-10">🚀 Start Your Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <Link
                to="/jobs"
                className="px-10 py-4 border-2 border-blue-600 text-blue-600 font-bold text-lg rounded-full hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              >
                💼 Browse Jobs
              </Link>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
              <StatCounter number="500" label="Active Jobs" delay={800} />
              <StatCounter number="150" label="Companies" delay={1000} />
              <StatCounter number="2000" label="Students" delay={1200} />
              <StatCounter number="95" label="Success Rate" delay={1400} />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent fade-in">
              Why Choose Career Hub?
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16 fade-in" style={{ animationDelay: '200ms' }}>
              Experience the future of career development
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon="🎯" 
                title="Smart Job Matching" 
                delay={400}
                direction="left"
              >
                AI-powered algorithms match you with perfect opportunities based on your skills, interests, and career goals.
              </FeatureCard>
              
              <FeatureCard 
                icon="🎤" 
                title="Real Interview Stories" 
                delay={600}
                direction="up"
              >
                Get insider knowledge from students who've been there. Real questions, real experiences, real success.
              </FeatureCard>
              
              <FeatureCard 
                icon="🏢" 
                title="Top Companies" 
                delay={800}
                direction="right"
              >
                Connect with leading startups and established companies actively hiring in Ahmedabad's tech ecosystem.
              </FeatureCard>
              
              <FeatureCard 
                icon="📚" 
                title="Skill Development" 
                delay={1000}
                direction="left"
              >
                Access curated learning resources and certification programs to boost your career prospects.
              </FeatureCard>
              
              <FeatureCard 
                icon="🤝" 
                title="Mentorship Network" 
                delay={1200}
                direction="up"
              >
                Connect with industry professionals and alumni for guidance, networking, and career advice.
              </FeatureCard>
              
              <FeatureCard 
                icon="⚡" 
                title="Instant Applications" 
                delay={1400}
                direction="right"
              >
                Apply to multiple positions with one click. Track your applications and get real-time updates.
              </FeatureCard>
            </div>
          </div>
        </section>
        
        {/* Testimonial Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl my-20">
          <div className="max-w-4xl mx-auto text-center px-8">
            <div className="text-6xl mb-8 fade-in">💬</div>
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-700 mb-8 fade-in italic" style={{ animationDelay: '200ms' }}>
              "Career Hub transformed my job search. I landed my dream internship at a top startup within 2 weeks!"
            </blockquote>
            <div className="fade-in" style={{ animationDelay: '400ms' }}>
              <div className="font-bold text-blue-600 text-xl">Priya Sharma</div>
              <div className="text-gray-600">Computer Science, Gujarat University</div>
            </div>
          </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="text-center py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 fade-in">
              Ready to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Accelerate</span> Your Career?
            </h2>
            <p className="text-xl text-gray-600 mb-12 fade-in" style={{ animationDelay: '200ms' }}>
              Join thousands of students and professionals who've found their perfect career match.
            </p>
            <div className="fade-in" style={{ animationDelay: '400ms' }}>
              <Link
                to="/register"
                className="inline-block px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-purple-500/25 transform hover:scale-110 transition-all duration-500 glow-effect"
              >
                🌟 Join the Revolution
              </Link>
            </div>
            <div className="mt-8 text-gray-500 fade-in" style={{ animationDelay: '600ms' }}>
              Proudly built in Ahmedabad, for Ahmedabad 🏙️
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

