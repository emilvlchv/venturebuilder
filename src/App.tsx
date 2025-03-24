
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import AppRoutes from './AppRoutes';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
