import "./styles/Login.css"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import axios from "axios"

import EcoCollectLogo from "../assets/EcoCollect-Logo.png"

export default function Login() {
    const navigate = useNavigate()

    async function loggingIn(formData) {
        const data = Object.fromEntries(formData)
        const { email, password } = data

        try {
            const {data} = await axios.post("/api/ecocollect/auth/login", { 
                email, password 
            });
            console.log("Server Response:", data);

            if(data.error) {
                toast.error(data.error)
            } 
            else if(data.user?.role === "admin") {
                toast.success("Admin logged in");
                navigate("/admin/usermanagement");
            } else {
                toast.success("User logged in")
                navigate("/home")
            }
        } catch (error) {
            console.log(error)
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
                <p className="register-el">Don't have an account? <Link className="register-btn" to={"/register"}>Register</Link></p>
                <p className="or-seperator">or</p>
                <button className="microsoftAcc-btn">Continue with Microsoft Account</button>
            </form>
        </div>
    )
}