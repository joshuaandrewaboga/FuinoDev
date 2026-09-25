import { Refine } from "@refinedev/core";
import { BrowserRouter } from "react-router";
import routerProvider from "@refinedev/react-router";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import Dashboard from "./pages/dashboard";
import "./App.css";
import "./portfolio.css";
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light">
        <Refine
          routerProvider={routerProvider}
          options={{ syncWithLocation: true }}
        >
          <Dashboard />
        </Refine>
      </ThemeProvider>
    </BrowserRouter>
  );
}
