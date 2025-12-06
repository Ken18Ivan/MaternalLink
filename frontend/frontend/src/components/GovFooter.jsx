import { MapPin, Phone, Mail, Facebook, Globe } from "lucide-react";
import coatLogo from "../assets/coat.webp"; // <--- IMPORT LOCAL IMAGE

const GovFooter = () => {
  return (
    <footer className="bg-[#2e2e2e] text-white pt-12 pb-8 relative z-50 text-sm">
      <div className="container mx-auto px-8">
        
        {/* TOP SECTION: 4 COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Republic Seal Identity */}
          <div className="flex flex-col items-start gap-4">
            {/* UPDATED IMAGE SOURCE */}
            <img 
              src={coatLogo} 
              alt="Coat of Arms" 
              className="w-24 h-24 opacity-90 grayscale hover:grayscale-0 transition-all duration-500 object-contain"
            />
            <div>
              <h3 className="font-bold uppercase tracking-widest text-gray-200">Republic of the Philippines</h3>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                All content is in the public domain unless otherwise stated. This system is maintained by the Department of Health - Center for Health Development Northern Mindanao.
              </p>
            </div>
          </div>

          {/* Column 2: About GOVPH */}
          <div>
            <h4 className="font-bold text-gray-200 mb-5 uppercase tracking-wider border-b border-gray-600 pb-2 inline-block">About GOVPH</h4>
            <p className="mb-4 text-xs leading-relaxed text-gray-400">
              Learn more about the Philippine government, its structure, how government works and the people behind it.
            </p>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Official Gazette</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Open Data Portal</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Office of the President</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Office of the Vice President</a></li>
            </ul>
          </div>

          {/* Column 3: Government Links */}
          <div>
            <h4 className="font-bold text-gray-200 mb-5 uppercase tracking-wider border-b border-gray-600 pb-2 inline-block">Gov Links</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Department of Health (DOH)</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">PhilHealth</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Senate of the Philippines</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">House of Representatives</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Supreme Court</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Sandiganbayan</a></li>
            </ul>
          </div>

          {/* Column 4: CONTACT US */}
          <div>
            <h4 className="font-bold text-gray-200 mb-5 uppercase tracking-wider border-b border-gray-600 pb-2 inline-block">Contact Us</h4>
            
            <div className="space-y-4 text-xs text-gray-400">
              {/* Address */}
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                <p>
                  <span className="block font-bold text-white mb-1">DOH Center for Health Development - Northern Mindanao</span>
                  J.V. Serina St., Carmen, Cagayan de Oro City 9000
                </p>
              </div>

              {/* Hotline */}
              <div className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-gray-500 shrink-0" />
                <div>
                  <p><span className="text-white font-bold">Hotline:</span> (088) 858-7123</p>
                  <p><span className="text-white font-bold">Emergency:</span> 911</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-gray-500 shrink-0" />
                <a href="mailto:info@ro10.doh.gov.ph" className="hover:text-white transition-colors">info@ro10.doh.gov.ph</a>
              </div>

              {/* Socials */}
              <div className="flex gap-4 mt-4 pt-4 border-t border-gray-700">
                <Facebook className="w-5 h-5 text-gray-500 hover:text-blue-500 cursor-pointer transition-colors" />
                <Globe className="w-5 h-5 text-gray-500 hover:text-green-500 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>

        </div>
        
        {/* BOTTOM COPYRIGHT LINE */}
        <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2025 MaternalLink Region X. All Rights Reserved.</p>
          <p className="italic">
            System developed for Academic Thesis Purposes • <span className="text-gray-400">MSU-IIT / MSU System</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default GovFooter;