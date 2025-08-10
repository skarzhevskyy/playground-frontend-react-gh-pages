interface WelcomeProps {
  onNavigateToFilms: () => void;
}

export function Welcome({ onNavigateToFilms }: WelcomeProps) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-4xl font-bold text-indigo-600" data-testid="welcome-title">Welcome</h1>
      <p className="text-lg text-gray-700 max-w-prose text-center">
        This is your freshly scaffolded React + TypeScript + Vite + Tailwind playground deployed to GitHub Pages.
      </p>
      
      <div className="flex gap-4">
        <button
          onClick={onNavigateToFilms}
          className="px-6 py-3 rounded bg-indigo-600 text-white hover:bg-indigo-500 transition font-medium"
        >
          View Star Wars Films
        </button>
        <a
          className="px-6 py-3 rounded border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition font-medium"
          href="https://vitejs.dev" target="_blank" rel="noreferrer"
        >
          Learn Vite
        </a>
      </div>
    </main>
  );
}
