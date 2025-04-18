import "./styles/Login.css";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";

import { UserContext } from "../context/userContext";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext); // ✅ Grab setUser from context

    async function loggingIn(formData) {
        const data = Object.fromEntries(formData);
        const { email, password } = data;

        try {
            const { data: response } = await axios.post("/api/ecocollect/auth/login", { 
                email, password 
            });

            console.log("Server Response:", response);

            if (response.error) {
                toast.error(response.error);
            } 
            else if (response.user?.role === "admin") {
                setUser(response.user); // ✅ Save user to context
                toast.success("Admin logged in");
                navigate("/admin/usermanagement");
            } else {
                setUser(response); // ✅ Save user to context
                toast.success("User logged in");
                navigate("/home");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="form-container">
            <img className="EcoCollect-logo" src={EcoCollectLogo} alt="EcoCollect-Logo" />
            <form action={loggingIn}>
                <h1>Login</h1>
                <p className="welcome-el">Welcome to EcoCollect!</p>

                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" required />

                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" required />

                <button className="login-btn">LOG IN</button>
                <p className="register-el">
                    Don't have an account? <Link className="register-btn" to={"/register"}>Register</Link>
                </p>
                <p className="or-seperator">or</p>
                <button className="microsoftAcc-btn">Continue with Microsoft Account</button>
            </form>
        </div>
    );
}
