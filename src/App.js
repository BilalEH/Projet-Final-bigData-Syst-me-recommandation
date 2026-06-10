import { useMemo, useState } from 'react';
import AppLayoutRoot, { AppLayoutContext } from './components/AppLayout';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [search, setSearch] = useState('');
  const contextValue = useMemo(() => ({ page, setPage, search, setSearch }), [page, search]);

  return (
    <AppLayoutContext.Provider value={contextValue}>
      <AppLayoutRoot />
    </AppLayoutContext.Provider>
  );
}
