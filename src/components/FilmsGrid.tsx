import { useState, useEffect, useMemo } from 'react';
import { graphqlClient, GET_ALL_FILMS, GET_SCHEMA, Film, FilmsResponse, SchemaResponse, SchemaField } from '../lib/graphql';

interface Column {
  key: string;
  label: string;
  description?: string;
  visible: boolean;
}

export function FilmsGrid() {
  const [films, setFilms] = useState<Film[]>([]);
  const [availableColumns, setAvailableColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering and sorting state
  const [titleFilter, setTitleFilter] = useState('');
  const [directorFilter, setDirectorFilter] = useState('');
  const [releaseDateFilter, setReleaseDateFilter] = useState('');
  const [sortField, setSortField] = useState<keyof Film>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Column configuration state
  const [showColumnConfig, setShowColumnConfig] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch films and schema in parallel
        const [filmsData, schemaData] = await Promise.all([
          graphqlClient.request<FilmsResponse>(GET_ALL_FILMS),
          graphqlClient.request<SchemaResponse>(GET_SCHEMA)
        ]);
        
        setFilms(filmsData.allFilms.films);
        
        // Extract Film type fields from schema
        const filmType = schemaData.__schema.types.find(type => type.name === 'Film');
        if (filmType?.fields) {
          const columns: Column[] = filmType.fields
            .filter((field: SchemaField) => 
              // Filter out connection fields and complex types
              !field.name.includes('Connection') && 
              field.type.kind !== 'OBJECT' ||
              ['title', 'director', 'releaseDate', 'producers', 'episodeID', 'id', 'openingCrawl', 'created', 'edited'].includes(field.name)
            )
            .map((field: SchemaField) => ({
              key: field.name,
              label: field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1'),
              description: field.description,
              visible: ['title', 'director', 'releaseDate'].includes(field.name) // Default visible columns
            }));
          
          setAvailableColumns(columns);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort films
  const filteredAndSortedFilms = useMemo(() => {
    let filtered = films.filter(film => {
      const titleMatch = film.title?.toLowerCase().includes(titleFilter.toLowerCase()) ?? true;
      const directorMatch = film.director?.toLowerCase().includes(directorFilter.toLowerCase()) ?? true;
      const releaseDateMatch = film.releaseDate?.includes(releaseDateFilter) ?? true;
      
      return titleMatch && directorMatch && releaseDateMatch;
    });

    // Sort films
    filtered.sort((a, b) => {
      const aValue = a[sortField] ?? '';
      const bValue = b[sortField] ?? '';
      
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [films, titleFilter, directorFilter, releaseDateFilter, sortField, sortDirection]);

  // Paginate films
  const paginatedFilms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedFilms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedFilms, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedFilms.length / itemsPerPage);
  const visibleColumns = availableColumns.filter(col => col.visible);

  const handleSort = (field: keyof Film) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleColumnVisibility = (columnKey: string) => {
    setAvailableColumns(prev => 
      prev.map(col => 
        col.key === columnKey ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (value === null || value === undefined) {
      return '-';
    }
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              placeholder="Filter by title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              data-testid="title-filter"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Director
            </label>
            <input
              type="text"
              value={directorFilter}
              onChange={(e) => setDirectorFilter(e.target.value)}
              placeholder="Filter by director..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Release Date
            </label>
            <input
              type="text"
              value={releaseDateFilter}
              onChange={(e) => setReleaseDateFilter(e.target.value)}
              placeholder="Filter by release date..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Column Configuration */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Column Configuration</h3>
          <button
            onClick={() => setShowColumnConfig(!showColumnConfig)}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {showColumnConfig ? 'Hide' : 'Show'} Columns
          </button>
        </div>
        
        {showColumnConfig && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {availableColumns.map(column => (
              <label key={column.key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={column.visible}
                  onChange={() => toggleColumnVisibility(column.key)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700" title={column.description}>
                  {column.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Results count and pagination controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-gray-600">
          Showing {paginatedFilms.length} of {filteredAndSortedFilms.length} films
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Items per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Films Grid */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {visibleColumns.map(column => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key as keyof Film)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    title={column.description}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {sortField === column.key && (
                        <span className="text-indigo-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedFilms.map(film => (
                <tr key={film.id} className="hover:bg-gray-50">
                  {visibleColumns.map(column => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatValue(film[column.key as keyof Film])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {paginatedFilms.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No films found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}