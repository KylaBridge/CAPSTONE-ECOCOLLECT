import React from 'react';
import BadgeShareCard from './BadgeShareCard';
import "./styles/BadgePreview.css";

const BadgePreview = () => {
  // Sample data for preview
  const previewUser = {
    name: "John Doe"
  };

  const previewBadge = {
    name: "Eco Warrior",
    description: "Recycling 10 items",
    img: "/path/to/badge-image.png"
  };

  return (
    <div className="badge-preview-container">
      <h2>Badge Share Card Preview</h2>
      <div className="preview-wrapper">
        <BadgeShareCard 
          user={previewUser}
          selectedBadge={previewBadge}
          isPreview={true}
        />
      </div>
    </div>
  );
};

export default BadgePreview; 