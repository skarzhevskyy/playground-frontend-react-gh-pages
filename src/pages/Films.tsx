import { useEffect, useMemo, useState } from 'react';
import { fetchGraphQLSchema, fetchFilms } from '../services/swapi';

interface FilmRow {
  id: string;
  title: string | null;
  director: string | null;
  releaseDate: string | null;
  producers?: string[] | null;
  [key: string]: unknown;
}

const DEFAULT_COLUMNS = ['title', 'director', 'releaseDate'];
const PAGE_SIZES = [3,5,10];

export function Films() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [films, setFilms] = useState<FilmRow[]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>(DEFAULT_COLUMNS);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);
  const [sort, setSort] = useState<{col: string; dir: 'asc'|'desc'}|null>(null);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterDirector, setFilterDirector] = useState('');
  const [filterRelease, setFilterRelease] = useState('');
  const [pageSize, setPageSize] = useState<number>(5);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const schema = await fetchGraphQLSchema();
        // Derive Film type fields from schema (naive introspection parsing)
        const filmType = schema.__schema.types.find((t:any)=>t.name==='Film');
        if (filmType) {
          const fieldNames = filmType.fields.map((f:any)=>f.name).filter((n:string)=>!n.toLowerCase().includes('connection'));
          setAvailableColumns(Array.from(new Set([...DEFAULT_COLUMNS, ...fieldNames])));
        }
        const filmData = await fetchFilms(DEFAULT_COLUMNS);
        if (!cancelled) setFilms(filmData);
      } catch (e:any) {
        if (!cancelled) setError(e.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // When selected columns change and include new ones not fetched yet, refetch with union
  useEffect(()=>{
    (async ()=>{
      const needed = Array.from(new Set([...DEFAULT_COLUMNS, ...selectedColumns]));
      try {
        const filmData = await fetchFilms(needed);
        setFilms(filmData);
      } catch(err){ /* ignore */ }
    })();
  }, [selectedColumns]);

  const processed = useMemo(()=>{
    let rows = films;
    if (filterTitle) {
      rows = rows.filter(r=> (r.title||'').toLowerCase().includes(filterTitle.toLowerCase()));
    }
    if (filterDirector) {
      rows = rows.filter(r=> (r.director||'').toLowerCase().includes(filterDirector.toLowerCase()));
    }
    if (filterRelease) {
      rows = rows.filter(r=> (r.releaseDate||'').toLowerCase().includes(filterRelease.toLowerCase()));
    }
    if (sort) {
      rows = [...rows].sort((a,b)=>{
        const av = a[sort.col];
        const bv = b[sort.col];
        if (av==null && bv==null) return 0;
        if (av==null) return sort.dir==='asc'? -1:1;
        if (bv==null) return sort.dir==='asc'? 1:-1;
        return String(av).localeCompare(String(bv), undefined, {numeric: true}) * (sort.dir==='asc'?1:-1);
      });
    }
    return rows;
  }, [films, filterTitle, filterDirector, filterRelease, sort]);

  const paginated = useMemo(()=>{
    const start = page * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, page, pageSize]);

  useEffect(()=>{ setPage(0); }, [filterTitle, filterDirector, filterRelease, pageSize]);

  function toggleSort(col: string) {
    setSort(s=>{
      if (!s || s.col!==col) return {col, dir:'asc'};
      if (s.dir==='asc') return {col, dir:'desc'};
      return null; // third click removes sort
    });
  }

  function toggleColumn(col: string) {
    setSelectedColumns(cols=> cols.includes(col)? cols.filter(c=>c!==col): [...cols, col]);
  }

  return (
    <main className="p-4 max-w-full" data-testid="films-page">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <a href="#/" className="text-indigo-600 underline" data-testid="nav-home">Home</a>
        <h1 className="text-2xl font-bold flex-1">Star Wars Films</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <label className="flex items-center gap-2 text-sm">Title:
            <input data-testid="filter-title" className="border rounded px-2 py-1" value={filterTitle} onChange={e=>setFilterTitle(e.target.value)} placeholder="Jedi" />
          </label>
          <label className="flex items-center gap-2 text-sm">Director:
            <input data-testid="filter-director" className="border rounded px-2 py-1" value={filterDirector} onChange={e=>setFilterDirector(e.target.value)} placeholder="Lucas" />
          </label>
          <label className="flex items-center gap-2 text-sm">Release:
            <input data-testid="filter-release" className="border rounded px-2 py-1" value={filterRelease} onChange={e=>setFilterRelease(e.target.value)} placeholder="1983" />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">Page size:
          <select data-testid="page-size" className="border rounded px-2 py-1" value={pageSize} onChange={e=>setPageSize(Number(e.target.value))}>
            {PAGE_SIZES.map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>
      {error && <div className="text-red-600" data-testid="error">{error}</div>}
      {loading && <div className="animate-pulse" data-testid="loading">Loading...</div>}
      {!loading && (
        <>
          <div className="mb-2 flex flex-wrap gap-2" data-testid="column-chooser">
            {availableColumns.map(c=> (
              <button key={c} onClick={()=>toggleColumn(c)} className={`text-xs px-2 py-1 rounded border ${selectedColumns.includes(c)?'bg-indigo-600 text-white':'bg-white'}`}>{c}</button>
            ))}
          </div>
          <div className="overflow-auto -mx-2">
            <table className="min-w-full text-sm" data-testid="films-table">
              <thead>
                <tr>
                  {selectedColumns.map(c=> (
                    <th key={c} className="px-2 py-1 text-left cursor-pointer select-none" onClick={()=>toggleSort(c)}>
                      <span className="inline-flex items-center gap-1">{c}{sort?.col===c && (sort.dir==='asc'? '▲':'▼')}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(film=> (
                  <tr key={film.id} className="odd:bg-gray-50 hover:bg-indigo-50 transition" data-testid="film-row">
                    {selectedColumns.map(c=> (
                      <td key={c} className="px-2 py-1 whitespace-nowrap">{Array.isArray(film[c])? (film[c] as any[]).join(', '): String(film[c] ?? '')}</td>
                    ))}
                  </tr>
                ))}
                {paginated.length===0 && <tr><td colSpan={selectedColumns.length} className="px-2 py-4 text-center text-gray-500">No results</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-4 mt-3" data-testid="pagination">
            <button className="px-2 py-1 border rounded disabled:opacity-40" onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}>Prev</button>
            <span className="text-sm">Page {page+1} / {Math.max(1, Math.ceil(processed.length / pageSize))}</span>
            <button className="px-2 py-1 border rounded disabled:opacity-40" onClick={()=>setPage(p=> (p+1) < Math.ceil(processed.length / pageSize)? p+1:p)} disabled={(page+1)>=Math.ceil(processed.length / pageSize)}>Next</button>
          </div>
        </>
      )}
    </main>
  );
}
