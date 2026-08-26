import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { QuickServices } from '../components/QuickServices';
import { MyApplications } from '../components/MyApplications';
import { UtilityCards } from '../components/UtilityCards';
import { NoticesAndSupport } from '../components/NoticesAndSupport';
import { TrustBar } from '../components/TrustBar';

interface HomePageProps {
  onOpenStateSelector: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenStateSelector }) => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        onOpenStateSelector={onOpenStateSelector}
        onSelectService={(serviceId) => navigate(`/apply/${serviceId}`)}
        onOpenStatus={() => navigate('/status')}
        onOpenRto={() => navigate('/rto-directory')}
        onOpenAppointment={() => navigate('/appointments')}
        onOpenFee={() => navigate('/fees')}
      />

      {/* Quick 7 Services */}
      <QuickServices
        onSelectService={(serviceId) => navigate(`/apply/${serviceId}`)}
        onViewAllServices={() => navigate('/services')}
      />

      {/* My Applications Showcase Carousel */}
      <MyApplications
        onOpenDetails={(appId) => navigate(`/status?appId=${appId}`)}
        onViewAllApplications={() => navigate('/applications')}
        onOpenNewApplication={() => navigate('/services')}
        onOpenAppointment={() => navigate('/appointments')}
      />

      {/* 4 Utility Cards */}
      <UtilityCards
        onCheckStatus={(appId) => navigate(`/status?appId=${appId}`)}
        onBookAppointment={() => navigate('/appointments')}
        onCalculateFee={() => navigate('/fees')}
        onFindRto={(query) => navigate(`/rto-directory?q=${encodeURIComponent(query)}`)}
      />

      {/* Notices & Support */}
      <NoticesAndSupport
        onOpenSupport={() => navigate('/grievance')}
      />

      {/* Trust & Security Proposition Pillars */}
      <TrustBar />
    </div>
  );
};
