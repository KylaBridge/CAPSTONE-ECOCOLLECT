import AdminSidebar from "../admin-components/AdminSidebar"
import Header from "../admin-components/Header"

export default function EWasteBin() {
    return (
        <>
            <AdminSidebar />
            <div className="admin-container">
              <Header 
                pageTitle="E-Waste Bin Monitoring" 
                adminName="Admin Name" 
                />
            </div>
        </>
    )
}