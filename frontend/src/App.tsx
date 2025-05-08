import { Routes, Route } from 'react-router-dom';
import Questionnaire from './pages/Questionnaire';
import Result from './pages/Resultat';
import Contact from './pages/Contact';
import { QuestionnaireProvider } from './context/QuestionnaireContext';


function App() {
  return (
    <QuestionnaireProvider>
      <Routes>
        <Route path="/" element={<Questionnaire />} />
        <Route path="/result" element={<Result />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
    </QuestionnaireProvider>
  );
}

export default App;
