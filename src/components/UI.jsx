import { Link } from "react-router-dom";
import { FileText, Download, ExternalLink, Globe, PlayCircle, Printer } from "lucide-react";

// --- 1. COMPOSANTS DE STRUCTURE ---

export const PageContainer = ({ children }) => (
  // Mobile : p-3 (petit padding) | Desktop : p-6
  <div className="w-full max-w-6xl mx-auto p-0 md:p-6 animate-in fade-in duration-500 print:max-w-none print:p-0">
    {children}
  </div>
);

export const BrandHeader = ({ title, subtitle, icon: Icon, logo, enablePrint = false }) => {
  const handlePrint = () => window.print();

  return (
    // Mobile : mb-6 | Desktop : mb-10
    <div className="mb-6 md:mb-10 text-center border-b border-slate-200 dark:border-slate-700 pb-6 md:pb-8 transition-colors flex flex-col items-center relative print:border-none print:mb-8 print:pb-0">
      
      {enablePrint && (
        <button 
          onClick={handlePrint}
          className="absolute right-0 top-0 no-print p-2 md:px-4 md:py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 dark:border-slate-700 transition-all text-xs font-bold"
          title="Imprimer"
        >
          <Printer size={16} /> <span className="hidden sm:inline ml-2">PDF</span>
        </button>
      )}

      {logo ? (
        <img src={logo} alt="Logo" className="h-16 w-16 md:h-24 md:w-24 mb-4 drop-shadow-xl hover:scale-105 transition-transform duration-500" />
      ) : Icon && (
        <div className="inline-block p-3 md:p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-4 text-indigo-600 dark:text-indigo-400 transition-colors print:hidden">
          <Icon size={32} className="md:w-12 md:h-12" />
        </div>
      )}
      
      {/* Mobile : text-2xl | Desktop : text-4xl */}
      <h1 className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2 transition-colors print:text-3xl print:mb-0 print:uppercase">{title}</h1>
      {subtitle && <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 px-4 print:text-lg print:italic print:mt-2">{subtitle}</p>}
    </div>
  );
};

export const SectionCard = ({ title, children, className="" }) => (
  // Mobile : p-4 | Desktop : p-6
  <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 md:p-6 shadow-sm transition-colors duration-300 print:shadow-none print:border-slate-300 print:break-inside-avoid ${className}`}>
    {title && <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2 print:text-black print:border-slate-300">{title}</h3>}
    <div className="text-slate-800 dark:text-slate-200 print:text-black">
      {children}
    </div>
  </div>
);

export const ToolsGrid = ({ children }) => (
  // Grid 1 colonne mobile, 2 tablettes, 3 desktop
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 print:grid-cols-2">
    {children}
  </div>
);

export const ToolCard = ({ to, title, description, icon: Icon, status = "active", badge, color = "indigo" }) => {
  const colorClasses = {
    indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-400",
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-400",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-400",
    purple: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-400",
    orange: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-400",
    cyan: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-400",
    slate: "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 group-hover:bg-slate-600 group-hover:text-white group-hover:border-slate-400",
  };
  const activeColor = colorClasses[color] || colorClasses.indigo;

  if (status === "disabled") {
    return (
      <div className="relative block bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 md:p-6 opacity-60 cursor-not-allowed overflow-hidden">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 mb-3 md:mb-4 grayscale">
          {Icon && <Icon size={20} className="md:w-6 md:h-6"/>}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-slate-400 mb-1 md:mb-2">{title}</h3>
        <p className="text-slate-400 text-xs md:text-sm">{description}</p>
      </div>
    );
  }

  return (
    <Link to={to} className="group relative block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 md:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-print active:scale-95">
      {badge && (
        <div className="absolute top-3 right-3 md:top-4 md:right-4">
          <span className={`text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full uppercase tracking-wide border ${
            badge === 'Nouveau' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400' : 
            badge === 'Bêta' ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400' :
            'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300'
          }`}>
            {badge}
          </span>
        </div>
      )}
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4 transition-colors duration-300 ${activeColor}`}>
        {Icon && <Icon size={20} className="md:w-6 md:h-6" />}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-1 md:mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mb-4 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center text-slate-400 dark:text-slate-500 font-bold text-xs md:text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        Accéder <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
};

export const FormInput = ({ label, value, onChange, type = "text", suffix, placeholder, prefix }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">{label}</label>
    <div className="flex items-center">
      {prefix && <span className="mr-2 text-slate-400 text-sm font-medium">{prefix}</span>}
      <input 
        type={type} 
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm placeholder:text-slate-400"
      />
      {suffix && <span className="ml-2 text-slate-400 text-sm font-medium">{suffix}</span>}
    </div>
  </div>
);

export const FormSelect = ({ label, value, onChange, options }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">{label}</label>
    <select 
      value={value} 
      onChange={onChange} 
      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export const ResultStat = ({ label, value, unit, color = "indigo" }) => {
  const colors = {
    indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800",
    green: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",
    orange: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800",
    red: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800",
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
  };
  const theme = colors[color] || colors.indigo;

  return (
    <div className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-xl border w-full transition-colors ${theme}`}>
      <span className="text-[10px] md:text-xs font-bold uppercase opacity-70 mb-1">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl md:text-3xl font-bold tracking-tight">{value}</span>
        <span className="text-xs md:text-sm font-medium opacity-80">{unit}</span>
      </div>
    </div>
  );
};

export const SectionTitle = ({ title, badge }) => (
  <h3 className="text-base md:text-lg font-bold text-slate-700 dark:text-slate-200 mb-4 md:mb-6 flex items-center gap-2 print:mb-2 print:text-black">
    {badge && (
      <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-[10px] md:text-xs uppercase tracking-wider print:border print:border-slate-300">
        {badge}
      </span>
    )}
    {title}
  </h3>
);

export const DocsGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
    {children}
  </div>
);

export const DocCard = ({ title, subtitle, link, type = "pdf" }) => {
  const config = {
    pdf: {
      icon: FileText,
      actionIcon: Download,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
      borderHover: "group-hover:border-red-200 dark:group-hover:border-red-800",
      badge: "PDF"
    },
    link: {
      icon: Globe,
      actionIcon: ExternalLink,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      borderHover: "group-hover:border-blue-200 dark:group-hover:border-blue-800",
      badge: "WEB"
    },
    default: {
      icon: FileText,
      actionIcon: ExternalLink,
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-50 dark:bg-slate-800",
      borderHover: "group-hover:border-slate-300 dark:group-hover:border-slate-600",
      badge: "DOC"
    }
  };

  const style = config[type] || config.default;
  const Icon = style.icon;
  const ActionIcon = style.actionIcon;

  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${style.borderHover} no-print active:scale-95`}
    >
      <div className={`h-10 w-10 md:h-12 md:w-12 rounded-lg flex items-center justify-center flex-none transition-colors ${style.bg} ${style.color}`}>
        <Icon size={20} className="md:w-6 md:h-6" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
           <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate pr-2">{title}</h4>
           <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-current opacity-70 ${style.color}`}>
             {style.badge}
           </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{subtitle}</p>
      </div>
      <div className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors">
        <ActionIcon size={18} />
      </div>
    </a>
  );
};