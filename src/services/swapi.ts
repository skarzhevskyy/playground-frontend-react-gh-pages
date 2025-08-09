// Per requirements use the public GraphQL endpoint
const ENDPOINT = 'https://swapi-graphql.netlify.app/graphql';

// Fetch GraphQL schema via introspection
export async function fetchGraphQLSchema() {
  const introspectionQuery = `query IntrospectionQuery {__schema { types { name fields { name } } } }`;
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: introspectionQuery })
  });
  if (!res.ok) throw new Error('Schema fetch failed');
  return await res.json();
}

// Dynamically build films query with requested fields
export async function fetchFilms(fields: string[]) {
  const safeFields = Array.from(new Set(['id', ...fields]))
    .filter(f => /^[A-Za-z_][A-Za-z0-9_]*$/.test(f));
  const query = `query AllFilms { allFilms { films { ${safeFields.join(' ')} } } }`;
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error('Films fetch failed');
  const json = await res.json();
  return json.data?.allFilms?.films ?? [];
}
