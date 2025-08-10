import { FilmsGrid } from '../components/FilmsGrid';

export function Films() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Star Wars Films</h1>
          <p className="mt-2 text-gray-600">
            Explore the Star Wars film collection with dynamic filtering, sorting, and column configuration.
          </p>
        </div>
        
        <FilmsGrid />
      </div>
    </div>
  );
}