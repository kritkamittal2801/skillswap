import { useState } from "react";
import api from "../services/api";

const Signup = () => {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/auth/signup",
                formData
            );

            alert(response.data.message);

        } catch (error) {

            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <input
                placeholder="Username"
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        username: e.target.value,
                    })
                }
            />

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
                Signup
            </button>

        </form>
    );
};

export default Signup;