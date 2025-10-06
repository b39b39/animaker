import { useEffect } from 'react';
import Board from './components/Board';
import { initIdentity } from './lib/identity';
import './lib/theme.css';

export default function App() {
  useEffect(() => { initIdentity(); }, []);
  return <Board />;
}
