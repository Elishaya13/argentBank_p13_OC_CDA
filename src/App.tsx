import { RouterProvider } from "react-router-dom";
import Router from "./routes/Router";
import './index.css'

function App() {
  return (
    <div className="App">
      <RouterProvider router={Router} />
    </div>
  );
  
}

export default App;

