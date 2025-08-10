import { useState } from 'react';
import { Welcome } from './pages/Welcome';
import { Films } from './pages/Films';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'welcome' | 'films'>('welcome');

  const renderPage = () => {
    switch (currentPage) {
      case 'films':
        return <Films />;
      default:
        return <Welcome onNavigateToFilms={() => setCurrentPage('films')} />;
    }
  };

  return (
    <div>
      {/* Simple navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => setCurrentPage('welcome')}
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === 'welcome'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Welcome
              </button>
              <button
                onClick={() => setCurrentPage('films')}
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === 'films'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Star Wars Films
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {renderPage()}
    </div>
  );
}
