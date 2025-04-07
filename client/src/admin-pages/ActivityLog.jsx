import AdminSidebar from "../admin-components/AdminSidebar"
import Header from "../admin-components/Header"

export default function ActivityLog() {
    return (
        <>
            <AdminSidebar />
            <div className="admin-container">
               <Header 
                    pageTitle="Activity Log" 
                    adminName="Admin Name" 
                />
            </div>
        </>
    )
}