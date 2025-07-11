import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FloatingBackground: React.FC = () => {
  const floatingElementsRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating elements animation
      if (floatingElementsRef.current) {
        const floatingElements = floatingElementsRef.current.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
          gsap.to(element, {
            y: "random(-20, 20)",
            x: "random(-10, 10)",
            rotation: "random(-15, 15)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.2
          });
        });
      }

      // Parallax effect
      if (parallaxRef.current) {
        gsap.to(parallaxRef.current, {
          yPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: parallaxRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const floatingIcons = [
    { icon: '🚀', top: '10%', left: '5%', delay: 0 },
    { icon: '💡', top: '20%', right: '10%', delay: 0.5 },
    { icon: '🎯', top: '60%', left: '8%', delay: 1 },
    { icon: '⚡', top: '80%', right: '15%', delay: 1.5 },
    { icon: '🌟', top: '15%', left: '15%', delay: 2 },
    { icon: '🔥', top: '70%', right: '5%', delay: 2.5 },
    { icon: '💎', top: '40%', left: '3%', delay: 3 },
    { icon: '🎨', top: '30%', right: '8%', delay: 3.5 },
  ];

  return (
    <>
      {/* Floating Background Elements */}
      <div ref={floatingElementsRef} className="fixed inset-0 pointer-events-none z-0">
        {floatingIcons.map((item, index) => (
          <div
            key={index}
            className="floating-element absolute text-6xl opacity-10 float-animation"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              animationDelay: `${item.delay}s`
            }}
          >
            {item.icon}
          </div>
        ))}
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl floating-element float-reverse-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400/10 to-yellow-400/10 rounded-lg rotate-45 floating-element rotate-slow"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-2xl floating-element float-animation"></div>
        <div className="absolute bottom-20 right-40 w-28 h-28 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-lg rotate-12 floating-element rotate-slow"></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-blue-300/20 rounded-full float-animation" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-20 h-20 border-2 border-purple-300/20 rounded-lg rotate-45 float-reverse-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-sm float-animation" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Parallax Background */}
      <div ref={parallaxRef} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50"></div>
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:100px_100px]"></div>
      </div>
    </>
  );
};

export default FloatingBackground;
