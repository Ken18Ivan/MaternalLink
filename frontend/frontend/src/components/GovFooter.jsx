import { Building2 } from "lucide-react";

const GovFooter = () => {
  return (
    <div className="bg-gray-800 text-white p-6 border-t-4 border-blue-600">
      <div className="flex items-center justify-between max-w-5xl mx-auto opacity-90">
        
        {/* LEFT: PH GOV */}
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-full">
            {/* Using an Icon as Placeholder for Coat of Arms */}
            <Building2 className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-wider text-sm">Republic of the Philippines</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">All content is in the public domain.</p>
          </div>
        </div>

        {/* RIGHT: LGU ILIGAN */}
        <div className="text-right hidden md:block">
          <h3 className="font-bold uppercase tracking-wider text-sm text-blue-300">LGU Iligan City</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Maternal Health Project • 2025</p>
        </div>

      </div>
    </div>
  );
};

export default GovFooter;