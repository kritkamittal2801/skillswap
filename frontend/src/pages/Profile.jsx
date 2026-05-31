import { useEffect, useState } from "react";
import api from "../services/api";

const Profile = () => {

    const [profile, setProfile] = useState(null);
    const [skills, setSkills] = useState("");

    // Fetch profile data
    const fetchProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/users/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProfile(response.data);

        } catch (error) {

            console.log(error);

        }
    };

    // Save profile
    const saveProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            await api.put(
                "/users/profile",
                {
                    skillsOffered: skills
                        .split(",")
                        .map(skill => skill.trim())
                        .filter(skill => skill !== "")
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Profile Updated Successfully");

            fetchProfile();

            setSkills("");

        } catch (error) {

            console.log(error);

            alert("Something went wrong");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div
            style={{
                maxWidth: "700px",
                margin: "40px auto",
                padding: "20px"
            }}
        >
            <h1>My Profile</h1>

            <hr />

            <h2>
                Username: {profile?.username}
            </h2>

            <p>
                Email: {profile?.email}
            </p>

            <p>
                Coins: {profile?.coins}
            </p>

            <hr />

            <h3>Skills I Can Teach</h3>

            {
                profile?.skillsOffered?.length > 0 ? (

                    profile.skillsOffered.map((skill) => (

                        <div key={skill}>
                            • {skill}
                        </div>

                    ))

                ) : (

                    <p>No skills added yet</p>

                )
            }

            <hr />

            <h3>Add New Skills</h3>

            <input
                type="text"
                placeholder="React, Node.js, MongoDB"
                value={skills}
                onChange={(e) =>
                    setSkills(e.target.value)
                }
                style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "15px"
                }}
            />

            <button
                onClick={saveProfile}
                style={{
                    padding: "10px 20px",
                    cursor: "pointer"
                }}
            >
                Save Profile
            </button>

        </div>
    );
};

export default Profile;