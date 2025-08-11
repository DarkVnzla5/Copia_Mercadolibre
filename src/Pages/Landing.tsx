import React from "react";
import HeroSection from "../components/HeroSection.tsx";
import FeaturesSection from "../components/Features.tsx";
import CallToActionSection from "../components/CallToaction.tsx";
import LoginPage from "../Pages/LogIn.tsx";
import SignUpPage from "../Pages/SignUp.tsx";

const Landing: React.FC = () => {
  return (
    <section>
      <HeroSection />
      <FeaturesSection />
      <CallToActionSection />
      <LoginPage />
      <SignUpPage />
    </section>
  );
};
export default Landing;
