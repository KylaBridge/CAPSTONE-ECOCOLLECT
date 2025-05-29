import "./styles/AdminRegister.css";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import BackgroundImage from "../assets/bgphoto-ecocollect.png";
import PartnershipLogos from "../assets/partnershiplogos.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AdminRegister(){
    const navigate = useNavigate();

    async function getRegisterData(formData) {
        const data = Object.fromEntries(formData);
        const { email, password, confirmPassword } = data;

        // Validate password confirmation
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const { data } = await axios.post("/api/ecocollect/auth/register-admin", {
                email,
                password,
            });
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success("Admin registered successfully");
                navigate("/admin/login");
            }
        } catch (error) {
            console.log(error);
            toast.error("Registration failed. Please try again.");
        }
    }

     return (
        <div className="admin-register-page">
            <div className="bg-form-container">
                <div className="admin-register-left">
                    <img className="forest-characters" src={BackgroundImage} alt="EcoCollect Characters" />
                </div>
                
                <div className="admin-register-right">
                    <img className="logo" src={EcoCollectLogo} alt="EcoCollect Logo" />
                    <form action={getRegisterData}>
                        <h1>Admin Registration</h1>
                        <p className="welcome-title">Welcome to EcoCollect!</p>
                
                        <label htmlFor="email">Admin Email ID</label>
                        <input id="email" type="email" name="email" required />
                
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" name="password" required />

                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input id="confirmPassword" type="password" name="confirmPassword" required />
                
                        <button className="register-btn">Register</button>
                        <p className="login-link">Already have an account? <Link to="/admin/login">Login</Link></p>
                        <p className="or-separator">or</p>
                        <button className="microsoftAcc-btn">Continue with Microsoft Account</button>
                    </form>
                    <img className="partnership-logos" src={PartnershipLogos} alt="Partnership Logos" />
                </div>
            </div>
        </div>
    );
}