import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import IntegrationRepository from "./modules/integration/infraestructure/IntegrationRepository";
import Environment from "./app/config/Environment";

function App() {
  const [count, setCount] = useState({});

  useEffect(() => {
    const repository = new IntegrationRepository();
    console.log(1);
    repository
      .getIntegration()
      .then((result) => {
        setCount(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        count is {JSON.stringify(count)}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <form action={`${Environment.apiUrl}/start`} method="get">
        <button>Connect</button>
      </form>
    </>
  );
}

export default App;
