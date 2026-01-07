import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./context/ThemeContext";

const Layout = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    // MODIFICATION ICI : bg-slate-100 (plus gris) au lieu de bg-slate-50 (trop blanc)
    // MODIFICATION ICI : text-slate-600 (plus doux) au lieu de text-slate-800 (trop noir)
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-600 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* Barre de navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-50 transition-colors">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="font-bold text-xl text-slate-800 dark:text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm">ER</span>
              <span className="hidden md:inline">Electro-Reims</span>
            </Link>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-600 hidden md:block"></div>

            <div className="flex gap-1 overflow-x-auto">
              <Link to="/gesco" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/gesco') ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}>GESCO</Link>
              <Link to="/etic" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/etic') ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}>Etic Telecom</Link>
              <Link to="/belden" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/belden') ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}>Belden</Link>
              <Link to="/siemens" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/siemens') ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}>Siemens</Link>
              <Link to="/stormshield" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/stormshield') ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}>Stormshield</Link>
              <Link to="/instrumentation" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/instrumentation') ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}>Instrumentation</Link>
            </div>
          </div>

          {/* Bouton Thème */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-none"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

        </div>
      </nav>

      <main className="w-full px-6 py-8 flex flex-col items-center flex-1">
        {children}
      </main>

      <footer className="w-full border-t border-slate-200 dark:border-slate-700 py-6 text-center text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 transition-colors">
        © 2025 Electro-Reims - Portail Technique
      </footer>

    </div>
  );
};

export default Layout;