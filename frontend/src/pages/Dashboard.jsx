import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

const Dashboard = () => {

    const { logout } = useContext(AuthContext);

    return (

        <div>

            Dashboard Page

            <button onClick={logout}>
                Logout
            </button>

        </div>
    );
};

export default Dashboard;