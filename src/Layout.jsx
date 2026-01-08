import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu } from "lucide-react"; // Menu non utilisé pour l'instant mais prêt
import { useTheme } from "./context/ThemeContext";

const Layout = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-600 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* Barre de navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-50 transition-colors">
        <div className="w-full px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Bloc Gauche : Logo + Menu */}
          <div className="flex items-center gap-3 md:gap-8 flex-1 min-w-0">
            
            {/* Logo */}
            <Link to="/" className="font-bold text-xl text-slate-800 dark:text-white flex items-center gap-2 hover:opacity-80 transition-opacity flex-none">
              <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm shadow-md shadow-indigo-200 dark:shadow-none">ER</span>
              <span className="hidden md:inline">Electro-Reims</span>
            </Link>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-600 hidden md:block flex-none"></div>

            {/* Menu Défilant (Scroll Horizontal sur Mobile) */}
            <div className="flex gap-2 overflow-x-auto flex-1 no-scrollbar mask-linear px-1 items-center">
              {[
                { path: '/gesco', label: 'GESCO', color: 'purple' },
                { path: '/etic', label: 'Etic', color: 'teal' },
                { path: '/belden', label: 'Belden', color: 'orange' },
                { path: '/siemens', label: 'Siemens', color: 'blue' },
                { path: '/stormshield', label: 'Stormshield', color: 'blue' },
                { path: '/instrumentation', label: 'Instrum.', color: 'indigo' }
              ].map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`
                    whitespace-nowrap px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all
                    ${isActive(item.path) 
                      ? `bg-${item.color}-50 text-${item.color}-700 dark:bg-${item.color}-900/30 dark:text-${item.color}-300 shadow-sm` 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bouton Thème (Fixe à droite) */}
          <button 
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-lg text-slate-400 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-none flex-none"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

        </div>
      </nav>

      {/* Contenu Principal avec Padding Mobile réduit */}
      <main className="w-full px-3 py-4 md:px-6 md:py-8 flex flex-col items-center flex-1">
        {children}
      </main>

      <footer className="w-full border-t border-slate-200 dark:border-slate-700 py-6 text-center text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 transition-colors">
        © 2025 Electro-Reims - Portail Technique
      </footer>

    </div>
  );
};

export default Layout;