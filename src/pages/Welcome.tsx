export function Welcome() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-4xl font-bold text-indigo-600" data-testid="welcome-title">Welcome</h1>
      <p className="text-lg text-gray-700 max-w-prose text-center">
        This is your freshly scaffolded React + TypeScript + Vite + Tailwind playground deployed to GitHub Pages.
      </p>
      <a
        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 transition"
        href="https://vitejs.dev" target="_blank" rel="noreferrer"
      >Learn Vite</a>
      <a
        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500 transition"
        href="#/films" data-testid="nav-films"
      >Star Wars Films</a>
    </main>
  );
}
