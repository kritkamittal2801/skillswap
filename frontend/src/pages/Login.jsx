import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/auth/login",
                formData
            );

            console.log(response.data);
            login(response.data.accessToken,response.data.user);

            navigate("/dashboard");

        } catch (error) {

            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="Email"
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        email: e.target.value,
                    })
                }
            />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        password: e.target.value,
                    })
                }
            />

            <button>
                Login
            </button>
        </form>
    );
};

export default Login;