import '../styles/App.css';
import logo from '../images/trace.svg';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const goToTest = () => {
    navigate('/test');
  };

  return (
    <div className="App">
      
      <h1 className="App-header">
        Bored Type
        <img src={logo} id={'standard-margins'}></img>
        <button className="start-button" onClick={goToTest}>Start</button>
      </h1>
    </div>
  );
}

export default App;
