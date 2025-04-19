import AdminSidebar from "../admin-components/AdminSidebar"
import Header from "../admin-components/Header"
import "./styles/ActivityLog.css";

export default function ActivityLog() {
    return (
        <>
            <AdminSidebar />
            <div className="activitymodule-container">
               <Header 
                    pageTitle="Activity Log" 
                    adminName="Admin Name" 
                />
            </div>
        </>
    )
}