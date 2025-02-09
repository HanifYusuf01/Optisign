import { Provider as UIProvider }  from "./components/ui/provider";
import Routes from "./Routes"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <UIProvider>
      <Routes/>
      <ToastContainer/>
    </UIProvider>
  )
}


export default App
