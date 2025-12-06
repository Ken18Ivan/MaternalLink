import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

const GovBanner = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date and time officially (e.g., Saturday, December 06, 2025, 3:00:00 PM)
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="bg-[#f2f2f2] text-[#444444] font-sans text-[13px] border-b border-gray-300 relative z-[60]">
      <div className="container mx-auto px-6 h-10 flex justify-between items-center">
        
        {/* LEFT SIDE: GOV.PH Identity */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-[#222]">GOV.PH</span>
          </div>

          {/* Desktop Links (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4 text-gray-600 font-medium">
            <a href="#" className="hover:text-blue-600 hover:underline transition-colors">Home</a>
            <a href="#" className="hover:text-blue-600 hover:underline transition-colors">About</a>
            <a href="#" className="hover:text-blue-600 hover:underline transition-colors">Official Gazette</a>
            <a href="#" className="hover:text-blue-600 hover:underline transition-colors">Open Data</a>
          </div>
        </div>

        {/* RIGHT SIDE: Time */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Icon (Only shows on small screens) */}
          <button className="md:hidden text-gray-600">
            <Menu className="w-4 h-4" />
          </button>

          <span className="hidden lg:inline font-bold text-gray-500 text-xs">Philippine Standard Time:</span>
          <span className="font-medium text-gray-800 text-xs md:text-[13px]">
            {formatTime(currentTime)}
          </span>
        </div>

      </div>
    </div>
  );
};

export default GovBanner;