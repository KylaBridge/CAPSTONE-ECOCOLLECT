import "./styles/Register.css"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import axios from "axios"

import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import PartnershipLogos from "../assets/partnershiplogos.png";

export default function Register() {
    const navigate = useNavigate()

    async function getRegisterData(formData) {
        const data = Object.fromEntries(formData)
        const { email, password } = data
        try {
          const {data} = await axios.post("/api/ecocollect/auth/register", {
            email, 
            password,
          })
          if(data.error) {
            toast.error(data.error)
          } else {
            toast.success("Registration Successful")
            navigate("/login")
          }
        } catch (error) {
          console.log(error)
        }
    }

    return (
        <div className="form-container">
            <img className="EcoCollect-logo" src={EcoCollectLogo} alt="EcoCollect-Logo" />
            <form className = "register-form" action={getRegisterData}>
                <h1>Register</h1>
                <p className="welcome-el">Welcome to EcoCollect!</p>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" required />

                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" required />

                <button className="register-btn2">REGISTER</button>
                <p className="register-el">Already have an account? <Link className="login-btn2" to={"/login"}>Login</Link></p>
                <p className="or-seperator">or</p>
                <button className="microsoftAcc-btn">Continue with Microsoft</button>
                <Link className="go-back-btn" to={"/"}>Go Back to Main</Link>
            </form>
            <img className="partnership-logo" src={PartnershipLogos} alt="NU x SM Cares Partnership" />
        </div>
    )
} 