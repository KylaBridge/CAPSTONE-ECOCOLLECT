import AdminSidebar from "../admin-components/AdminSidebar"
import Header from "../admin-components/Header"

export default function AchieversModule() {
    return (
        <>
            <AdminSidebar />
            <div className="admin-container">
                <Header 
                    pageTitle="Achievers Module" 
                    adminName="Admin Name" 
                />
            </div>
        </>
    )
}