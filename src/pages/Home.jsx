import React, { useState, useEffect, useCallback, useRef } from 'react';
import { href } from 'react-router-dom';
import { Link } from 'react-router-dom';


// Utility component for the SVG icon used in the logo
const LogoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M3 13h2v8H3zm4-8h2v13H7zm4-2h2v15h-2zm4 4h2v11h-2zm4-2h2v13h-2z"/>
  </svg>
);

// Navigation Data
const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'documentation', label: 'Documentation', href: '/documentation' },
    // { id: 'reports', label: 'Reports' },
  { id: 'contact', label: 'Contact' },
  { id: 'login', label: 'Login', href: '/login' }, // Target link is defined here
];

// Reusable Section Component
const Section = ({ id, title, children, className = '' }) => (
  <section id={id} className={`py-16 md:py-24 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {title && <h2 className="text-4xl font-extrabold text-white text-center mb-16">{title}</h2>}
      {children}
    </div>
  </section>
);

// --- 1. Navbar Component ---
const Navbar = ({ activeSection, onLinkClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const baseClasses = "fixed top-0 z-50 w-full transition-all duration-300 backdrop-blur-lg";
  const scrolledClasses = "bg-gray-900/90 shadow-2xl py-2";
  const topClasses = "bg-transparent py-4";

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const handleInternalLinkClick = (id) => {
    onLinkClick(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`${baseClasses} ${isScrolled ? scrolledClasses : topClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="#home" onClick={() => handleInternalLinkClick('home')} className="flex items-center text-white text-2xl font-bold transition duration-300 hover:text-cyan-400">
            <div className="mr-3 p-1 rounded-full bg-cyan-500/20 text-cyan-400">
              <LogoIcon />
            </div>
            <span className="logo-text">Api Testing</span>
          </a>

          {/* Desktop Links */}
          <ul className="hidden md:flex space-x-8">
            {navLinks.map(link => {
              // Check if the link has a non-fragment href (like /documentation or /login)
              const isRouteLink = !!link.href && !link.href.startsWith('#');
              // Use the defined href for route links, or a fragment for section links
              const linkHref = isRouteLink ? link.href : `#${link.id}`; 
              
              return (
                <li key={link.id}>
                  <a
                    href={linkHref}
                    // Attach smooth scroll handler only if it is NOT a route link
                    onClick={isRouteLink ? null : (e) => {
                         e.preventDefault();
                         handleInternalLinkClick(link.id);
                      }}
                    className={`
                      text-lg font-medium transition duration-300 relative
                      ${activeSection === link.id && !isRouteLink ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}
                      ${activeSection === link.id && !isRouteLink ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}
                      ${link.id === 'login' ? 'px-3 py-1 border border-cyan-500 rounded-md hover:bg-cyan-600/20' : ''}
                      after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:bg-cyan-400 after:transition-transform after:duration-300
                    `}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>


          {/* Mobile Menu Button */}
          <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-gray-900/95 shadow-lg`}>
        <ul className="flex flex-col space-y-2 p-4">
          {navLinks.map(link => {
              const isRouteLink = !!link.href && !link.href.startsWith('#');
            const linkHref = isRouteLink ? link.href : `#${link.id}`;

            return (
              <li key={link.id}>
                <a
                  href={linkHref}
                  // Attach smooth scroll handler only if it is NOT a route link
                  onClick={isRouteLink ? null : () => handleInternalLinkClick(link.id)}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition duration-300 ${activeSection === link.id && !isRouteLink ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

// --- 2. Hero Section Component ---
const HeroSection = () => (
  <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900 pt-16">
    <div className="absolute inset-0 z-0 opacity-20 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    
    {/* Geometric Shapes */}
    <div className="absolute inset-0">
      <div className="absolute w-60 h-60 bg-cyan-500/30 rounded-full blur-3xl top-10 left-1/4 animate-pulse-slow"></div>
      <div className="absolute w-40 h-40 bg-pink-500/30 rounded-full blur-3xl bottom-10 right-1/4 animate-pulse-slow delay-1000"></div>
    </div>

    {/* Content */}
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between text-white text-center lg:text-left pt-20">
      
      {/* Hero Text */}
      <div className="lg:w-1/2 mb-12 lg:mb-0">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          API Testing Tool<br className="hidden sm:inline" />
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-lg mx-auto lg:mx-0">
          {/* Transform your data into actionable insights with our cutting-edge analytics platform. Real-time monitoring, intelligent predictions, and beautiful visualizations. */}
        </p>
        {/* Updated link to navigate to /login */}
        <a href="/login" className="inline-block px-10 py-4 bg-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:bg-cyan-500 transition duration-300 transform hover:scale-105">
          Login
        </a>
      </div>
      
      {/* Hero Visual (Simplified Data City) */}
      <div className="lg:w-1/2 flex justify-center lg:justify-end opacity-70">
        <div className="relative w-64 h-64 md:w-96 md:h-96 transform rotate-45">
          <div className="absolute w-full h-full border-4 border-cyan-400/50 rounded-lg animate-spin-slow"></div>
          <div className="absolute inset-4 border-4 border-pink-500/50 rounded-lg animate-spin-slow reverse delay-500"></div>
          <div className="absolute inset-8 flex items-center justify-center">
            <svg className="w-16 h-16 text-cyan-400 animate-bounce" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h2v8H3zm4-8h2v13H7zm4-2h2v15h-2zm4 4h2v11h-2zm4-2h2v13h-2z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- 3. Dashboard Section Components ---

const StatCard = ({ icon, title, value, description, chartId, data }) => {
  const chartRef = useRef(null);
  
  // Placeholder for simple visualization
  useEffect(() => {
    if (chartRef.current) {
      // Simple visual data representation using Tailwind for bars
      chartRef.current.innerHTML = data.map(val => (
        <div 
          key={val} 
          style={{ height: `${val}%` }} 
          className="w-1/6 bg-cyan-500 rounded-t-full transition-all duration-1000"
        ></div>
      )).join('');
    }
  }, [data]);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl transition duration-500 hover:shadow-cyan-500/30 border border-gray-700/50 flex flex-col">
      <div className="flex items-center mb-4">
        <div className="text-3xl mr-3">{icon}</div>
        <div className="text-lg font-semibold text-gray-300">{title}</div>
      </div>
      <div className="text-4xl font-bold text-white mb-2">{value}</div>
      <div className="text-sm text-gray-400 mb-4 flex-grow">{description}</div>
      <div className="h-16 flex items-end justify-around space-x-1" ref={chartRef}>
        {/* Chart content is rendered in useEffect */}
      </div>
    </div>
  );
};

const STATS_DATA = [
  { icon: '📊', title: 'Total Revenue', value: '$42,847', description: 'Monthly revenue increased by 23% compared to last month with strong performance.', data: [30, 60, 45, 75, 50, 80] },
  { icon: '👥', title: 'Active Users', value: '18.5K', description: 'Real-time analytics showing active users currently engaging with the platform.', data: [90, 85, 95, 80, 75, 99] },
  { icon: '🎯', title: 'Conversion Rate', value: '94.3%', description: 'Customer satisfaction rate based on recent surveys and feedback analysis.', data: [65, 70, 55, 85, 60, 70] },
  { icon: '🚀', title: 'Performance Score', value: '7,392', description: 'Overall system performance metrics showing optimal operation across all services.', data: [50, 40, 60, 55, 70, 65] },
  { icon: '💰', title: 'Monthly Growth', value: '+28.5%', description: 'Consistent month-over-month growth in user acquisition and revenue generation.', data: [20, 40, 60, 80, 70, 90] },
  { icon: '⚡', title: 'System Uptime', value: '99.9%', description: 'Exceptional reliability with minimal downtime ensuring seamless user experience.', data: [100, 100, 95, 100, 100, 98] },
];

const DashboardSection = () => (
  <Section id="dashboard" title="Dashboard Overview" className="bg-gray-950">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {STATS_DATA.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  </Section>
);

// --- 4. Analytics Section Components ---

const METRICS_DATA = [
  { value: '2.4M', label: 'Page Views' },
  { value: '156K', label: 'Unique Visitors' },
  { value: '4.2min', label: 'Avg Session' },
  { value: '68%', label: 'Return Rate' },
  { value: '89', label: 'NPS Score' },
  { value: '3.2K', label: 'Daily Active' },
];

const MetricItem = ({ value, label }) => (
  <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700/50 text-center transition duration-300 hover:bg-gray-700">
    <div className="text-3xl font-bold text-cyan-400 mb-1">{value}</div>
    <div className="text-sm text-gray-400">{label}</div>
  </div>
);

const ChartCard = ({ title, options, children }) => {
  const [activeOption, setActiveOption] = useState(options[0]);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700/50">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <div className="flex space-x-3 text-sm">
          {options.map(option => (
            <button
              key={option}
              onClick={() => setActiveOption(option)}
              className={`px-3 py-1 rounded-full transition duration-200 ${
                activeOption === option
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 flex items-center justify-center">
        {React.cloneElement(children, { activeOption })}
      </div>
    </div>
  );
};

// Placeholder for Bar Chart
const BarChartComponent = ({ activeOption }) => {
  const barData = activeOption === '2024'
    ? [60, 80, 45, 70, 90, 65, 75, 85]
    : activeOption === '2023'
    ? [50, 70, 35, 60, 80, 55, 65, 75]
    : [40, 60, 25, 50, 70, 45, 55, 65];

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

  return (
    <div className="w-full h-full flex items-end justify-around space-x-3 p-4">
      {barData.map((height, index) => (
        <div key={index} className="flex flex-col items-center h-full justify-end w-1/8">
          <div className="text-xs text-gray-400 mb-1">{height * 2}</div> {/* Show value */}
          <div
            style={{ height: `${height}%` }}
            className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg shadow-lg transition-all duration-700 hover:opacity-80"
          ></div>
          <div className="text-xs text-gray-500 mt-1">{labels[index]}</div>
        </div>
      ))}
    </div>
  );
};

// Placeholder for SVG Line Chart
const LineChartComponent = ({ activeOption }) => {
  // Simple path data for an upward trend
  const pathData = "M 0,200 L 62,180 L 125,150 L 187,170 L 250,120 L 312,140 L 375,100 L 437,130 L 500,110";

  return (
    <svg className="line-chart-svg w-full h-full" viewBox="0 0 500 300" preserveAspectRatio="none">
      <defs>
        <linearGradient id="gradientLine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor:'#00ffcc', stopOpacity:0.5}} />
          <stop offset="100%" style={{stopColor:'#00ffcc', stopOpacity:0}} />
        </linearGradient>
      </defs>
      
      {/* Grid lines */}
      {[50, 100, 150, 200, 250].map(y => (
        <line key={y} x1="0" y1={y} x2="500" y2={y} className="stroke-gray-700/50 stroke-1" />
      ))}
      
      {/* Area */}
      <path d={`${pathData} L 500,300 L 0,300 Z`} fill="url(#gradientLine)" />
      
      {/* Line */}
      <path d={pathData} stroke="#00ffcc" strokeWidth="3" fill="none" className="filter drop-shadow-lg" />
      
      {/* Dots (simplified for React) */}
      <circle cx="0" cy="200" r="5" fill="#00ffcc" className="shadow-xl" />
      <circle cx="250" cy="120" r="5" fill="#00ffcc" className="shadow-xl" />
      <circle cx="500" cy="110" r="5" fill="#00ffcc" className="shadow-xl" />
    </svg>
  );
};

const GeoBarChart = ({ activeOption }) => {
  const geoData = [
    { label: 'USA', value: 42, color: 'from-red-500 to-red-400' },
    { label: 'EU', value: 28, color: 'from-green-500 to-green-400' },
    { label: 'Asia', value: 18, color: 'from-blue-500 to-blue-400' },
    { label: 'Other', value: 12, color: 'from-purple-500 to-purple-400' },
  ];

  return (
    <div className="w-full h-full flex items-end justify-around space-x-3 p-4">
      {geoData.map((data) => (
        <div key={data.label} className="flex flex-col items-center h-full justify-end w-1/4">
          <div className="text-sm text-gray-400 mb-1">{data.value}%</div>
          <div
            style={{ height: `${data.value * 2}%` }}
            className={`w-full bg-gradient-to-t ${data.color} rounded-t-lg shadow-lg transition-all duration-700 hover:opacity-90`}
          ></div>
          <div className="text-xs text-gray-500 mt-1">{data.label}</div>
        </div>
      ))}
     
    </div>
  );
};

const DeviceLineChart = ({ activeOption }) => {
  // Mock data for two lines (Mobile vs Desktop)
  const mobileData = [180, 160, 140, 120, 100, 90, 80, 70];
  const desktopData = [220, 210, 200, 190, 185, 180, 175, 170];
  const points = [0, 71, 142, 214, 285, 357, 428, 500];

  const createPath = (data) => data.map((y, i) => `${i === 0 ? 'M' : 'L'} ${points[i]},${y}`).join(' ');

  return (
    <svg className="line-chart-svg w-full h-full" viewBox="0 0 500 300" preserveAspectRatio="none">
      {/* Grid lines */}
      {[60, 120, 180, 240].map(y => (
        <line key={y} x1="0" y1={y} x2="500" y2={y} className="stroke-gray-700/50 stroke-1" />
      ))}
      
      {/* Mobile Line */}
      <path d={createPath(mobileData)} stroke="#ff6b6b" strokeWidth="3" fill="none" className="filter drop-shadow-lg" />
      {mobileData.map((y, i) => <circle key={`m-${i}`} cx={points[i]} cy={y} r="5" fill="#ff6b6b" className="shadow-xl" />)}
      
      {/* Desktop Line */}
      <path d={createPath(desktopData)} stroke="#00ffcc" strokeWidth="3" fill="none" className="filter drop-shadow-lg" />
      {desktopData.map((y, i) => <circle key={`d-${i}`} cx={points[i]} cy={y} r="5" fill="#00ffcc" className="shadow-xl" />)}
      
      {/* Labels */}
      <text x="450" y="70" fill="#ff6b6b" fontSize="16" fontWeight="bold">Mobile</text>
      <text x="450" y="170" fill="#00ffcc" fontSize="16" fontWeight="bold">Desktop</text>
    </svg>
  );
};


const AnalyticsSection = () => (
  <Section id="analytics" title="Advanced Analytics" className="bg-gray-900">
    {/* Metrics Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
      {METRICS_DATA.map((metric, index) => (
        <MetricItem key={index} {...metric} />
      ))}
    </div>

    {/* Charts Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ChartCard title="📈 Monthly Trends" options={['2024', '2023', '2022']}>
        <BarChartComponent />
      </ChartCard>

      <ChartCard title="📊 Growth Analytics" options={['Week', 'Month', 'Year']}>
        <LineChartComponent />
      </ChartCard>

      <ChartCard title="🌍 Geographic Distribution" options={['Global', 'US', 'EU']}>
        <GeoBarChart />
      </ChartCard>

      <ChartCard title="📱 Device Analytics" options={['This Month', 'Last Month', 'YTD']}>
        <DeviceLineChart />
      </ChartCard>
    </div>
  </Section>
);

// --- 5. Reports Section Components ---
const INFO_DATA = [
  { icon: '💼', title: 'Business Intelligence', value: '98.5%', description: 'Accuracy in predictive analytics and business forecasting models.' },
  { icon: '📱', title: 'Mobile Analytics', value: '2.4M', description: 'Mobile app downloads and active user engagement metrics.' },
  { icon: '🌍', title: 'Global Reach', value: '150+', description: 'Countries actively using our analytics platform worldwide.' },
  { icon: '🚀', title: 'Performance Index', value: '847', description: 'Comprehensive performance scoring across all platform metrics.' },
  { icon: '⚡', title: 'Response Time', value: '0.2s', description: 'Average API response time ensuring optimal user experience.' },
  { icon: '📊', title: 'Data Processing', value: '12TB', description: 'Daily data volume processed through our analytics pipeline.' },
];

const InfoCard = ({ icon, title, value, description }) => (
  <div className="bg-gray-800 p-6 rounded-xl shadow-2xl transition duration-500 hover:shadow-cyan-500/30 border-l-4 border-cyan-500 flex flex-col justify-between">
    <div>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
    </div>
    <div className="mt-4">
      <div className="text-3xl font-bold text-cyan-400 mb-2">{value}</div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

const ReportsSection = () => (
  <Section id="reports" title="Reports & Insights" className="bg-gray-950">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {INFO_DATA.map((info, index) => (
        <InfoCard key={index} {...info} />
      ))}
    </div>
  </Section>
);

// --- 6. Contact Section Components ---

const ContactForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to a backend API.
    // NOTE: Avoid using window.alert in production apps. Using a custom modal is recommended.
    console.log("Message sent! (Mock Submission)");
    e.target.reset();
  };
  
  // Custom Alert component to replace native alert()
  const [showAlert, setShowAlert] = useState(false);

  const mockSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);
    e.target.reset();
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="relative">
      {showAlert && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 p-4 bg-green-600 text-white rounded-lg shadow-2xl z-20 transition-all duration-300">
          Message sent successfully! (Mock Submission)
        </div>
      )}
     
    </div>
  );
};
// --- Data Definition ---
const CONTACT_INFO_DATA = [
  { icon: '📧', title: 'Email Address', details: ['anjupavithranm95@gmail.com'], href: 'mailto:hello@graphpage.com' },
  { icon: '📞', title: 'Phone Number', details: ['+91665434567', 'Available 24/7'], href: 'tel:+15551234567' },
  { icon: '📍', title: 'Office Location', details: ['India ,Thrissur, Suite 100', 'Analytics City, AC 12345'], href: 'https://maps.google.com/?q=123+Data+Drive+Suite+100+Analytics+City' },
  { icon: '🕒', title: 'Business Hours', details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Weekend: Emergency support only'] },
];

// --- Component Definition ---
const ContactInfoItem = ({ icon, title, details, href }) => {
  const content = (
    <>
      {/* Icon: Large, cyan, visually separates it from text */}
      <div className="text-4xl mr-4 text-cyan-400 min-w-[3rem] text-center">{icon}</div>
      
      {/* Text Content */}
      <div className="flex-grow">
        <h4 className="text-xl font-bold text-white mb-0.5">{title}</h4>
        {details.map((detail, i) => (
          <p key={i} className="text-sm text-gray-300 leading-snug">{detail}</p>
        ))}
      </div>
    </>
  );


  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-start p-4 bg-gray-800 rounded-lg transition duration-300 hover:bg-gray-700 hover:shadow-xl">
      {content}
    </a>
  ) : (
    <div className="flex items-start p-4 bg-gray-800 rounded-lg">
      {content}
    </div>
  );
};

const ContactSection = () => (
  <Section id="contact" title="Get In Touch" className="bg-gray-900">
   
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white mb-6 hidden lg:block">Contact Information</h3>
        {CONTACT_INFO_DATA.map((item, index) => (
          <ContactInfoItem key={index} {...item} />
        ))}
       
   
    </div>
  </Section>
);

// --- 7. Footer Component ---
const Footer = () => (
  <footer className="bg-gray-950/90 py-8 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
      <p className="copyright">
        © 2026 api testing. All rights reserved anju. 
          <a href="https://templatemo.com" rel="nofollow noopener" target="_blank" className="text-cyan-400 hover:text-cyan-300 transition duration-300"></a>
      </p>
    </div>
  </footer>
);

// --- Main App Component ---
export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const sectionRefs = useRef({});

  // Initialize section refs
  useEffect(() => {
    // Only map links that correspond to sections (i.e., not the external login link)
    navLinks.filter(link => !link.href || link.href.startsWith('#') || link.href.startsWith('/'))
            .forEach(link => {
      sectionRefs.current[link.id] = document.getElementById(link.id);
    });
  }, []);

  // Intersection Observer for active section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Only update active section for internal scrollable sections
            if (entry.target.id !== 'login') {
              setActiveSection(entry.target.id);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5, // Highlight when 50% of the section is visible
      }
    );

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const handleLinkClick = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 70, // Adjust for fixed navbar height
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  }, []);

  // Tailwind CSS Setup (Imported via CDN in the surrounding environment)
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
    
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; background-color: #0d1117; }

    /* Custom Animation */
    @keyframes pulse-slow {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.05); opacity: 0.5; }
    }
    .animate-pulse-slow {
      animation: pulse-slow 6s infinite ease-in-out;
    }
    @keyframes spin-slow {
      from { transform: rotate(45deg); }
      to { transform: rotate(405deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 30s linear infinite;
    }
    .animate-spin-slow.reverse {
      animation-direction: reverse;
    }

    /* Background Grid for Hero */
    .bg-grid-white\/\%5 {
        background-image: linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent);
        background-size: 30px 30px;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gray-950 antialiased">
        <Navbar activeSection={activeSection} onLinkClick={handleLinkClick} />
        
        <main>
          <HeroSection />
         
          <ContactSection />
        </main>
        
        <Footer />
      </div>
    </>
  );
}