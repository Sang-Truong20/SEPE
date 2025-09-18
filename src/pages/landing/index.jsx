import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SEALLandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out',
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style jsx>{`
        .text-gradient {
          background: linear-gradient(135deg, #01bd30 0%, #66cc99 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .card-gradient {
          background: linear-gradient(
            135deg,
            rgba(1, 189, 48, 0.1) 0%,
            rgba(102, 204, 153, 0.1) 100%
          );
        }
        .hover-glow:hover {
          box-shadow: 0 0 30px rgba(1, 189, 48, 0.3);
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .grid-pattern {
          background-image:
            linear-gradient(rgba(1, 189, 48, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(1, 189, 48, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>

      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-lg py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <span className="font-bold text-2xl">SEAL</span>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="hover:text-primary transition-colors">
                Home
              </a>
              <a
                href="#features"
                className="hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#hackathons"
                className="hover:text-primary transition-colors"
              >
                Hackathons
              </a>
              <a
                href="#timeline"
                className="hover:text-primary transition-colors"
              >
                Timeline
              </a>
              <a href="#faq" className="hover:text-primary transition-colors">
                FAQ
              </a>
              <button className="bg-primary text-black px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:scale-105">
                Register Now
              </button>
            </div>

            <button className="lg:hidden">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center grid-pattern"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3s' }}
        ></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div data-aos="fade-down" className="mb-6">
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                🚀 FPT University HCMC
              </span>
            </div>

            <h1
              data-aos="fade-up"
              className="text-6xl md:text-8xl font-black mb-6 leading-tight"
            >
              SEAL <span className="text-gradient">Hackathon</span>
              <br />
              Management System
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
            >
              Revolutionizing academic hackathon management with fairness,
              transparency, and automation
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="flex flex-wrap gap-6 justify-center"
            >
              <button className="bg-primary text-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform hover-glow">
                Get Started →
              </button>
              <button className="border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                Watch Demo
              </button>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">3</div>
                <div className="text-gray-400">Annual Events</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">500+</div>
                <div className="text-gray-400">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">100+</div>
                <div className="text-gray-400">Teams</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-5xl font-bold mb-4">
              Powerful <span className="text-gradient">Features</span>
            </h2>
            <p className="text-xl text-gray-400">
              End-to-end competition management platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🏆',
                title: 'Chapter Management',
                desc: 'Seamlessly organize Spring, Summer, and Fall hackathons',
                features: [
                  'Event scheduling',
                  'Resource allocation',
                  'Timeline tracking',
                ],
              },
              {
                icon: '👥',
                title: 'Team Registration',
                desc: 'Smart team formation and member management',
                features: [
                  'Auto-matching',
                  'Skill assessment',
                  'Team dashboard',
                ],
              },
              {
                icon: '👨‍🏫',
                title: 'Mentor Assignment',
                desc: 'Intelligent mentor-team pairing system',
                features: [
                  'Expertise matching',
                  'Availability tracking',
                  'Communication hub',
                ],
              },
              {
                icon: '📤',
                title: 'Submission Handling',
                desc: 'Secure project submission and version control',
                features: [
                  'Multi-format support',
                  'Deadline enforcement',
                  'Backup system',
                ],
              },
              {
                icon: '⚖️',
                title: 'Judge Evaluation',
                desc: 'Fair and transparent scoring mechanisms',
                features: [
                  'Blind review',
                  'Multi-criteria scoring',
                  'Real-time feedback',
                ],
              },
              {
                icon: '🎁',
                title: 'Prize Distribution',
                desc: 'Automated prize allocation and tracking',
                features: [
                  'Smart distribution',
                  'Certificate generation',
                  'Winner showcase',
                ],
              },
            ].map((feature, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="card-gradient border border-white/10 rounded-2xl p-8 hover:border-primary/50 transition-all hover-glow group"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-4">{feature.desc}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center text-sm text-gray-500"
                    >
                      <span className="text-primary mr-2">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathons Section */}
      <section id="hackathons" className="py-24 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-5xl font-bold mb-4">
              Three Epic <span className="text-gradient">Hackathons</span>
            </h2>
            <p className="text-xl text-gray-400">
              Each season brings unique challenges and opportunities
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                season: 'Spring',
                theme: 'SDLC Mastery',
                color: '#01bd30',
                date: 'March - April',
                topics: [
                  'Agile Development',
                  'CI/CD Pipeline',
                  'Code Quality',
                  'Testing Strategies',
                ],
              },
              {
                season: 'Summer',
                theme: 'Emerging Tech',
                color: '#00994D',
                date: 'June - July',
                topics: [
                  'AI/ML Integration',
                  'Blockchain',
                  'IoT Solutions',
                  'Cloud Native',
                ],
              },
              {
                season: 'Fall',
                theme: 'Product & UX',
                color: '#66CC99',
                date: 'September - October',
                topics: [
                  'User Research',
                  'Design Systems',
                  'Prototyping',
                  'User Testing',
                ],
              },
            ].map((hackathon, index) => (
              <div
                key={index}
                data-aos="zoom-in"
                data-aos-delay={index * 150}
                className="relative group"
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{ backgroundColor: hackathon.color }}
                ></div>
                <div className="relative bg-black border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: hackathon.color }}
                  >
                    <span className="text-2xl font-bold text-black">
                      {hackathon.season[0]}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">
                    {hackathon.season}
                  </h3>
                  <p
                    className="text-xl mb-4"
                    style={{ color: hackathon.color }}
                  >
                    {hackathon.theme}
                  </p>
                  <p className="text-gray-400 mb-6">{hackathon.date}</p>
                  <div className="space-y-3">
                    {hackathon.topics.map((topic, i) => (
                      <div key={i} className="flex items-center text-gray-500">
                        <div
                          className="w-2 h-2 rounded-full mr-3"
                          style={{ backgroundColor: hackathon.color }}
                        ></div>
                        {topic}
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-8 w-full py-3 rounded-lg font-semibold transition-all hover:scale-105"
                    style={{ backgroundColor: hackathon.color, color: 'black' }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10"></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-5xl font-bold mb-4">
              Event <span className="text-gradient">Timeline</span>
            </h2>
            <p className="text-xl text-gray-400">
              Your journey through SEAL 2024
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                date: 'January 15',
                title: 'Registration Opens',
                desc: 'Team formation and early bird registration begins',
                status: 'completed',
              },
              {
                date: 'March 1-30',
                title: 'Spring Hackathon',
                desc: 'SDLC focused challenges and workshops',
                status: 'completed',
              },
              {
                date: 'June 1-30',
                title: 'Summer Hackathon',
                desc: 'Emerging technologies exploration',
                status: 'active',
              },
              {
                date: 'September 1-30',
                title: 'Fall Hackathon',
                desc: 'Product design and user experience',
                status: 'upcoming',
              },
              {
                date: 'November 15',
                title: 'Grand Finale',
                desc: 'Annual awards and recognition ceremony',
                status: 'upcoming',
              },
            ].map((event, index) => (
              <div
                key={index}
                className="flex items-center mb-12"
                data-aos="fade-right"
                data-aos-delay={index * 100}
              >
                <div className="flex-shrink-0 w-32 text-right pr-8">
                  <p className="text-gray-500">{event.date}</p>
                </div>
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      event.status === 'completed'
                        ? 'bg-primary'
                        : event.status === 'active'
                          ? 'bg-primary animate-pulse'
                          : 'bg-gray-600'
                    }`}
                  ></div>
                  {index < 4 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-24 bg-gray-600"></div>
                  )}
                </div>
                <div
                  className={`flex-grow pl-8 ${event.status === 'upcoming' ? 'opacity-50' : ''}`}
                >
                  <h3 className="text-2xl font-bold mb-1">{event.title}</h3>
                  <p className="text-gray-400">{event.desc}</p>
                  {event.status === 'active' && (
                    <span className="inline-block mt-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                      Currently Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Total Participants', icon: '👥' },
              { value: '100+', label: 'Teams Formed', icon: '🏆' },
              { value: '50+', label: 'Expert Mentors', icon: '👨‍🏫' },
              { value: '10M+', label: 'Prize Pool (VND)', icon: '💰' },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-5xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-5xl font-bold mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Who can participate in SEAL hackathons?',
                a: 'All FPT University HCMC students from SE Department are eligible to participate.',
              },
              {
                q: 'How many members can be in a team?',
                a: 'Teams can have 3-5 members, with at least one member from each academic year.',
              },
              {
                q: 'Are there any participation fees?',
                a: 'No, SEAL hackathons are completely free for all registered students.',
              },
              {
                q: 'What are the prizes?',
                a: 'Prizes include cash rewards, internship opportunities, tech gadgets, and certificates.',
              },
              {
                q: 'Can we participate in all three hackathons?',
                a: 'Yes! We encourage students to participate in all seasonal events to maximize learning.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 50}
                className="card-gradient border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all"
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <span className="text-primary mr-3">▶</span>
                  {faq.q}
                </h3>
                <p className="text-gray-400 ml-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto" data-aos="zoom-in">
            <h2 className="text-5xl font-bold mb-6">
              Ready to <span className="text-gradient">Revolutionize</span> Your
              Hackathon Experience?
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Join the most innovative hackathon series at FPT University HCMC
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <button className="bg-primary text-black px-10 py-5 rounded-xl font-bold text-xl hover:scale-105 transition-transform hover-glow">
                Register Your Team
              </button>
              <button className="border border-white/20 px-10 py-5 rounded-xl font-bold text-xl hover:bg-white/10 transition-all">
                View Guidelines
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/5 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-xl">S</span>
                </div>
                <span className="font-bold text-xl">SEAL</span>
              </div>
              <p className="text-gray-400">Software Engineering Agile League</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-primary">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Rules
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-primary">Hackathons</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Spring - SDLC
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Summer - Emerging Tech
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Fall - Product/UX
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Past Winners
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-primary">Connect</h4>
              <p className="text-gray-400 mb-4">
                FPT University HCMC
                <br />
                SE Department & PDP
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition"
                >
                  <span>f</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition"
                >
                  <span>in</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition"
                >
                  <span>@</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 SEAL - Software Engineering Agile League. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SEALLandingPage;
