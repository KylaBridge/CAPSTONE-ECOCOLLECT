import AdminSidebar from "../admin-components/AdminSidebar"
import Header from "../admin-components/Header"
import "./styles/AchieversModule.css";

export default function AchieversModule() {
    return (
        <>
            <AdminSidebar />
            <div className="achieversmodule-container">
                <Header 
                    pageTitle="Achievers Module" 
                    adminName="Admin Name" 
                />
            </div>
        </>
    )
}