import AdminSidebar from "../admin-components/AdminSidebar"
import Header from "../admin-components/Header"
import "./styles/AnalyticsDashboard.css"

export default function AnalyticsDashboard() {
    return (
        <>
         <AdminSidebar />
         <div className="analyticsmodule-container">
            <Header 
                pageTitle="Analytics Dashboard" 
                adminName="Admin Name" 
            />
        </div>
         
        </>
    )
}