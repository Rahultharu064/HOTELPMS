import React from "react";
import PublicLayout from "../../components/publicwebsite/Homepage/Sections/PublicLayout";
import HeroSection from "../../components/publicwebsite/Homepage/Sections/HeroSection";
import RoomByCategory from "../../components/publicwebsite/Homepage/Sections/RoomTypesSection";
import RoomPreviewSection from "../../components/publicwebsite/Homepage/Sections/RoomPreviewSection";
import FacilitiesSection from "../../components/publicwebsite/Homepage/Sections/FacilitiesSection";
import ReviewsSection from "../../components/publicwebsite/Homepage/Sections/ReviewsSection";

const Homepage: React.FC = () => (
  <PublicLayout>
    <HeroSection />

    {/* Browse by Type */}
    <RoomByCategory />

    {/* Featured Room Listings */}
    <RoomPreviewSection />

    {/* Amenities Section */}
    <FacilitiesSection />

    {/* Guest Testimonials */}
    <ReviewsSection />
  </PublicLayout>
);

export default Homepage;
