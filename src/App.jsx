import { Navigate, Route, Routes } from 'react-router-dom';
import Landing from './routes/Landing.jsx';
import Background from './routes/diagnostic/Background.jsx';
import CareerBreak from './routes/diagnostic/CareerBreak.jsx';
import Preferences from './routes/diagnostic/Preferences.jsx';
import Snapshot from './routes/Snapshot.jsx';
import Gap from './routes/Gap.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/diagnostic/background" element={<Background />} />
      <Route path="/diagnostic/break" element={<CareerBreak />} />
      <Route path="/diagnostic/preferences" element={<Preferences />} />
      <Route path="/diagnostic/snapshot" element={<Snapshot />} />
      <Route path="/diagnostic/gap" element={<Gap />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
