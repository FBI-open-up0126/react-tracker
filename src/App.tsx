import { BrowserRouter } from "react-router-dom";
import "./App.scss";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <MainContent />
      <Sidebar />
    </BrowserRouter>
  );
}
