import AdminSidebar from "../admin-components/AdminSidebar"
import Header from "../admin-components/Header"

export default function AnalyticsDashboard() {
    return (
        <>
         <AdminSidebar />
         <div className="admin-container">
            <Header 
                pageTitle="Analytics Dashboard" 
                adminName="Admin Name" 
            />
        </div>
         
        </>
    )
}