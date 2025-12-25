import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ServicesPage.css';

const services = [
  {
    title: "Package A",
    subtitle: "Photo & Video Coverage",
    description:
      "Detailed photo and video coverage from preparation, ceremony, and reception.\n•100 printed photos (4R size)\n•USB containing all soft copies",
    price: "₱ 20,000",
    image: "imagesGallery/packa.png",
  },
  {
     title: "Package B",
    subtitle: "Photo & Video Coverage with Prenup",
    description:
      "Detailed photo and video coverage from preparation, ceremony, and reception.\n•Prenup photo session included\n•1 blow-up photo (A3 size)\n•100 printed photos (4R size)\n•USB containing all soft copies",
    price: "₱ 30,000",
    image: "/imagesGallery/packb.png",
  },
  {
  title: "Package C",
    subtitle: "Photo & Video Coverage with Prenup & SDE Video",
    description:
      "Same Day Edit (SDE) Video. Detailed photo and video coverage from preparation to reception.\n•Pre-debut photo session included\n•1 blow-up photo (A3 size)\n•100 printed photos (4R size)\n•USB containing all soft copies",
    price: "₱ 45,000",
    image: "/imagesGallery/packc.png",
  },
   {
    title: "Concept Shoot",
    description:
      "Photo session only (unlimited)\nWith themed decor (you can request your own theme)\n•Unlimited shoot for 2 sets of outfits provided by the client\n•With soft edited copies\n\nFreebies:\n•1pc blow up A3 size\n•6pcs 4R size",
    price: "₱ 6,000",
    image: "/imagesGallery/kids.png",
  },
  {
    title: "Classic Portrait",
    description:
      "Unlimited Shots\nWith soft and hard copies\n\n•FREEBIE: Video behind the scenes from our TikTok account",
    price: "₱ 6,000",
    image: "/imagesGallery/classicP.png",
  },
  {
    title: "Looking for something custom?",
    description: "Contact us to create a personalized photography package that fits your unique needs and budget.",
    isCustom: true,
  },
];

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card) => {
      if (observerRef.current) {
        observerRef.current.observe(card);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleBookNow = () => {
    navigate('/booking');
  };

  const handleContact = () => {
    navigate('/contact');
  };

  return (
    <section id="services" className="services-page-container">
      <div className="services-section">
        <div className="services-header">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Professional photography services tailored to capture your most precious moments
          </p>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div className={`service-card ${service.isCustom ? 'custom-card' : ''}`} key={index}>
              {!service.isCustom && (
                <div className="service-image-container">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="service-image"
                    loading="lazy"
                  />
                  <div className="service-image-overlay">
                    <span className="service-category">{service.title}</span>
                  </div>
                </div>
              )}
              
              <div className="service-content">
                <h3 className="service-title">{service.subtitle || service.title}</h3>
                <p className="service-description">{service.description}</p>
                {service.price && <p className="service-price">{service.price}</p>}
                <button className="cta-button" onClick={service.isCustom ? handleContact : handleBookNow}>
                  <span>{service.isCustom ? 'Contact Us' : 'Book Now'}</span>
                  <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default ServicesPage;