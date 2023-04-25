import React, { useState, useCallback } from "react";
import "./App.css";
import Products from "./components/Products";
import Loader from "./components/ui/Loader";

interface AppContextInterface {
  toggleLoading: () => void;
}
export const AppContext = React.createContext<AppContextInterface>({
  toggleLoading: () => {},
});

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const toggleLoading = useCallback(() => {
    setIsLoading((prev) => !prev);
  }, []);

  return (
    <div className='App'>
      <AppContext.Provider value={{ toggleLoading }}>
        <Products></Products>
      </AppContext.Provider>
      {isLoading && <Loader />}
    </div>
  );
}

export default App;
