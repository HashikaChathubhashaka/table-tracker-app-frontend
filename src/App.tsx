import { BrowserRouter as Router, Route, Routes } from "react-router";
import ItemMenu from "./ItemMenu";
import Home from "./Home";
import Table from "./table";
import Login from "./login";
import PrivateRoute from "./privateRoute";
import AdminSettings from "./AdminSettings";
import Header from './Header';
import Toolbar from '@mui/material/Toolbar';

function App() {

  
  return (
    <div>

            
      <Router>
              <Header />
      <Toolbar variant="dense"  /> {/* Spacer for fixed AppBar */}
      <Toolbar variant="dense" style={{ minHeight: 1 }} /> {/* Even smaller spacer for fixed AppBar */}
  <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/menu/:tableNumber" element={
              <PrivateRoute>
                <ItemMenu />
              </PrivateRoute>
            } />
            <Route path="/table/:tableNumber" element={<Table />} />
            <Route path="/admin-user-settings" element={
              <PrivateRoute>
                <AdminSettings />
              </PrivateRoute>
            } />
          </Routes>
        </div>
        </Router>
        <footer style={{
          backgroundColor: "#263238",
          color: "#fff",
          textAlign: "center",
          padding: "0.5rem 0",
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100%",
          fontSize: "0.7rem",
          letterSpacing: "0.5px",
          zIndex: 1000
        }}>
          © {new Date().getFullYear()} Hashika Chathubhashaka. All rights reserved.
        </footer>
    </div>
  );
}

export default App;