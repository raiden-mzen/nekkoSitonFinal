import React, { useState } from "react";
import "../styles/GalleryPage.css";

interface Photo {
  id: number;
  image: string;
  title: string;
  description: string;
  category: string;
}

const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const photos: Photo[] = [
     {
      id: 1,
      image: "imagesGallery/fam.jpg",
      title: "Family Photography",
      description: "Captures warm and genuine moments between family members, highlighting their bond and shared experiences. Perfect for preserving memories that last a lifetime..",
      category: "portrait",
    },
    {
      id: 2,
      image: "imagesGallery/commercial.jpg",
      title: "Product Photography",
      description: "Showcase your products with professional commercial photography.",
      category: "event",
    },
    {
      id: 3,
      image: "imagesGallery/wed2.JPG",
      title: "Wedding Details",
      description: "Capture every precious detail of your special day.",
      category: "event",
    },
    {
      id: 4,
      image: "imagesGallery/concept2.JPG",
      title: "Concept Shoot",
      description: "Creative and theme-based photography that brings imaginative ideas to life using styling, props, and artistic direction.",
      category: "Concepts",
    },
    {
      id: 5,
      image: "imagesGallery/animal.JPG",
      title: "Pet Photography",
      description: "Celebrates pets in their most adorable and natural moments, capturing their personality and charm.",
      category: "portrait",
    },
    {
      id: 6,
      image: "imagesGallery/couple.jpg",
      title: "Couple's Session",
      description: "A romantic photo session that showcases the connection, chemistry, and story of two people in love.",
      category: "portrait",
    },
    {
      id: 7,
      image: "imagesGallery/bday2.jpg",
      title: "Birthday Celebration",
      description: "Captures the excitement, joy, and key moments of a birthday event, from candid reactions to special highlights.",
      category: "event",
    },
    {
      id: 8,
      image: "imagesGallery/boud.png",
      title: "Boudoir Photography",
      description: "An intimate and empowering photoshoot that embraces confidence, beauty, and elegance in a tasteful, artistic way.",
      category: "Concepts",
    },
    {
      id: 9,
      image: "imagesGallery/grad.JPG",
      title: "Graduation Portrait",
      description: "Honors a graduate’s hard work and achievements with polished, memorable portraits that mark an important milestone.",
      category: "portrait",
    },
  ];

  const categories = [
    { id: "all", label: "All Photos" },
    { id: "Concepts", label: "Concepts" },
    { id: "portrait", label: "Portraits" },
    { id: "event", label: "Events" },
    
  ];

  const filteredPhotos =
    activeCategory === "all"
      ? photos
      : photos.filter((photo) => photo.category === activeCategory);

  const openModal = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="gallery-container">
      <h1 className="gallery-title">Our Gallery</h1>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-tab ${
              activeCategory === category.id ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="photo-grid">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="photo-card"
            onClick={() => openModal(photo)}
          >
            <img src={photo.image} alt={photo.title} className="photo-img" />
            <div className="photo-overlay">
              <h3>{photo.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPhoto && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.title}
              className="modal-img"
            />
            <div className="modal-info">
              <h2>{selectedPhoto.title}</h2>
              <p>{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;