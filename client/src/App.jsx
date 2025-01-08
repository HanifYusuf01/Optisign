import { Provider as UIProvider }  from "./components/ui/provider";
import Routes from "./Routes"
function App() {
  return (
    <UIProvider>
      <Routes/>
    </UIProvider>
  )
}


export default App
