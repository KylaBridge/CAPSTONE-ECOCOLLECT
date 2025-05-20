import "./styles/AdminLoginPage.css";
import EcoCollectLogo from "../assets/EcoCollect-Logo.png";
import BackgroundImage from "../assets/bgphoto-ecocollect.png";
import PartnershipLogos from "../assets/partnershiplogos.png";

export default function AdminLogIn(){
     return (
        <div className="admin-login-page">
            <div className="bg-form-container">
                <div className="admin-login-left">
                    <img className="forest-characters" src={BackgroundImage} alt="EcoCollect Characters" />
                </div>
                
                <div className="admin-login-right">
                    <img className="logo" src={EcoCollectLogo} alt="EcoCollect Logo" />
                    <form>
                        <h1>Admin Login</h1>
                        <p className="welcome-title">Welcome to EcoCollect!</p>
                
                        <label htmlFor="email">Admin Email ID</label>
                        <input id="email" type="email" name="email" required />
                
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" name="password" required />
                
                        <button className="login-btn">LOG IN</button>
                        <p className="or-separator">or</p>
                        <button className="microsoftAcc-btn">Continue with Microsoft Account</button>
                    </form>
                    <img className="partnership-logos" src={PartnershipLogos} alt="Partnership Logos" />
                </div>
            </div>
        </div>
    );
}