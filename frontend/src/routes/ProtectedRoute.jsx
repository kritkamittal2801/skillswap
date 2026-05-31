import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

    const { token } = useContext(AuthContext);

    return token
        ? children
        : <Navigate to="/login" />;
};

export default ProtectedRoute;