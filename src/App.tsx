import { useEffect, useState } from 'react';
import { Welcome } from './pages/Welcome';
import { Films } from './pages/Films';

export default function App() {
  const [route, setRoute] = useState<string>(() => window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handler = () => setRoute(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  switch (route) {
    case '/films':
      return <Films />;
    default:
      return <Welcome />;
  }
}
