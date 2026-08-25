import React, { useState } from 'react';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { SEARCH_SUGGESTIONS } from '../data/mockData';
import { useApp } from '../context/AppContext';

interface HeroSectionProps {
  onOpenStateSelector: () => void;
  onSelectService: (serviceId: string) => void;
  onOpenStatus: () => void;
  onOpenRto: () => void;
  onOpenAppointment: () => void;
  onOpenFee: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenStateSelector,
  onSelectService,
  onOpenStatus,
  onOpenRto,
  onOpenAppointment,
  onOpenFee
}) => {
  const { 
    t, 
    darkMode, 
    currentState, 
    isDetectingLocation, 
    detectLiveLocation, 
    locationAccuracy 
  } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredSuggestions = SEARCH_SUGGESTIONS.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuggestionClick = (suggestion: typeof SEARCH_SUGGESTIONS[0]) => {
    setSearchQuery(suggestion.label);
    setIsSearchFocused(false);

    if (suggestion.action === 'service') {
      onSelectService(suggestion.id);
    } else if (suggestion.action === 'status') {
      onOpenStatus();
    } else if (suggestion.action === 'appointment') {
      onOpenAppointment();
    } else if (suggestion.action === 'fee') {
      onOpenFee();
    } else if (suggestion.action === 'rto') {
      onOpenRto();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const match = SEARCH_SUGGESTIONS.find(s => 
      s.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (match) {
      handleSuggestionClick(match);
    } else {
      onOpenStatus();
    }
  };

  return (
    <section className={`relative overflow-hidden min-h-[460px] lg:min-h-[500px] flex items-center transition-colors duration-200 ${
      darkMode 
        ? 'bg-slate-900 text-white' 
        : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      
      {/* Full-Bleed Hero Background on the right */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[62%] pointer-events-none z-0 overflow-hidden">
        <img 
          src="/assets/hero_car_city.jpg" 
          alt="Connected blue car on highway to city" 
          className="w-full h-full object-cover object-center lg:object-right opacity-40 sm:opacity-70 lg:opacity-95 dark:opacity-40 lg:dark:opacity-75"
        />
        {/* Soft horizontal fading gradient */}
        <div className={`absolute inset-0 w-full lg:w-[65%] ${
          darkMode 
            ? 'bg-gradient-to-r from-slate-900 via-slate-900/90 sm:via-slate-900/80 to-transparent' 
            : 'bg-gradient-to-r from-[#F4F7FB] via-[#F4F7FB]/95 sm:via-[#F4F7FB]/85 lg:via-[#F4F7FB]/50 to-transparent'
        }`} />
        {/* Soft bottom merging gradient */}
        <div className={`absolute inset-0 ${
          darkMode ? 'bg-gradient-to-t from-slate-900 via-transparent to-slate-900/30' : 'bg-gradient-to-t from-[#F4F7FB] via-transparent to-white/20'
        }`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 pb-12 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Content Area */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 max-w-2xl">
            
            {/* Main Headline */}
            <div className="space-y-0.5 sm:space-y-1">
              <h1 className={`text-2xl sm:text-3xl lg:text-[42px] font-black tracking-tight leading-[1.2] font-sans ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {t.heroHeadline1}
              </h1>
              <h1 className="text-2xl sm:text-3xl lg:text-[42px] font-black tracking-tight text-[#0056D2] leading-[1.2] font-sans">
                {t.heroHeadline2}
              </h1>
            </div>

            {/* Subtitle */}
            <p className={`text-xs sm:text-sm lg:text-base font-normal leading-relaxed max-w-lg ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {t.heroSubtitle}
            </p>

            {/* Wide Smart Search Container */}
            <div className="relative pt-2 max-w-lg">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <div className={`w-full relative flex items-center rounded-full border shadow-lg shadow-blue-900/5 transition-all p-1.5 pl-4 pr-1.5 ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-700 focus-within:border-[#0056D2]' 
                    : 'bg-white border-slate-250 hover:border-blue-300 focus-within:border-[#0056D2] focus-within:ring-4 focus-within:ring-blue-100'
                }`}>
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mr-2.5 flex-shrink-0" />
                  
                  <div className="flex-1 flex flex-col justify-center py-0.5">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      placeholder={t.searchPlaceholder}
                      className={`w-full text-xs sm:text-sm font-semibold placeholder:text-slate-400 focus:outline-hidden bg-transparent ${
                        darkMode ? 'text-white' : 'text-slate-800'
                      }`}
                    />
                    <span className="text-[10px] sm:text-[11px] text-slate-400 pointer-events-none select-none">
                      {t.searchExample}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0056D2] hover:bg-[#0047b3] text-white flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-blue-500/30 active:scale-95 transition-all cursor-pointer ml-1"
                    aria-label="Search"
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </form>

              {/* Auto-suggest Dropdown */}
              {isSearchFocused && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setIsSearchFocused(false)} 
                  />
                  <div className={`absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-2xl border py-2 z-30 animate-in fade-in zoom-in-95 duration-150 max-h-72 overflow-y-auto ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Suggested Services & Actions
                    </div>
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(item)}
                          className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center justify-between transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center space-x-2.5">
                            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                            <span className="font-medium group-hover:text-blue-600">{item.label}</span>
                          </div>
                          <span className="text-[11px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-full">
                            {item.category}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-center text-xs text-slate-400">
                        No specific service found.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Popular Searches Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className={`text-xs font-bold mr-1 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                {t.popularSearches}
              </span>
              
              <button
                type="button"
                onClick={() => onSelectService('dl-new')}
                className={`px-3 py-1 border rounded-full text-xs font-medium transition cursor-pointer shadow-2xs ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-250 hover:border-blue-300 text-slate-700 hover:text-blue-700'
                }`}
              >
                {t.applyForDl}
              </button>

              <button
                type="button"
                onClick={() => onSelectService('dl-renew')}
                className={`px-3 py-1 border rounded-full text-xs font-medium transition cursor-pointer shadow-2xs ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-250 hover:border-blue-300 text-slate-700 hover:text-blue-700'
                }`}
              >
                {t.dlRenewal}
              </button>

              <button
                type="button"
                onClick={onOpenStatus}
                className={`px-3 py-1 border rounded-full text-xs font-medium transition cursor-pointer shadow-2xs ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-250 hover:border-blue-300 text-slate-700 hover:text-blue-700'
                }`}
              >
                {t.checkStatus}
              </button>

              <button
                type="button"
                onClick={onOpenRto}
                className={`px-3 py-1 border rounded-full text-xs font-medium transition cursor-pointer shadow-2xs ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-250 hover:border-blue-300 text-slate-700 hover:text-blue-700'
                }`}
              >
                {t.rtoContact}
              </button>
            </div>

          </div>

          {/* Right Floating Location Badge Area (Vertically Centered in Middle) */}
          <div className="lg:col-span-5 flex justify-start sm:justify-end items-center my-auto pt-2 lg:pt-0">
            <div className={`backdrop-blur-md border rounded-2xl p-3.5 sm:p-4 shadow-lg sm:shadow-xl max-w-full sm:max-w-[260px] w-full animate-in fade-in duration-300 ${
              darkMode ? 'bg-slate-800/95 border-slate-700 text-white' : 'bg-white/95 border-slate-200/90 text-slate-900'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5 text-emerald-500">
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center flex-shrink-0 relative">
                      <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {t.detectedLocation}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => detectLiveLocation()}
                  disabled={isDetectingLocation}
                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                  title="Detect GPS location"
                >
                  <span>{isDetectingLocation ? 'Locating...' : 'Auto-Detect'}</span>
                </button>
              </div>
              
              <p className="text-sm font-extrabold leading-tight">
                {currentState}
              </p>

              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-150 dark:border-slate-700/80">
                <button
                  type="button"
                  onClick={onOpenStateSelector}
                  className="text-xs font-bold text-[#0056D2] hover:text-[#0047b3] flex items-center gap-1 group transition cursor-pointer"
                >
                  <span>{t.changeState}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </button>

                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full uppercase">
                  {locationAccuracy === 'gps' ? 'GPS Live' : locationAccuracy === 'ip' ? 'IP Geo' : 'Selected'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
