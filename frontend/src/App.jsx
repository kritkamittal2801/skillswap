import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateRequest from "./pages/CreateRequest";
import RequestFeed from "./pages/RequestFeed";
import RequestDetail from "./pages/RequestDetail";


import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

  return (

      <Routes>

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

                <Route
        path="/profile"
        element={
          <ProtectedRoute>
              <Profile />
          </ProtectedRoute>
        }
        />

        <Route
        path="/requests/create"
        element={<CreateRequest />}
      />

      <Route
        path="/requests"
        element={<RequestFeed />}
      />

      <Route
      path="/requests/:id"
      element={<RequestDetail />}
    />
      </Routes>

  );
}

export default App;