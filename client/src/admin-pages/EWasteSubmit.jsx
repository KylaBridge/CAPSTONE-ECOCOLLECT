import AdminSidebar from "../admin-components/AdminSidebar"
import Header from "../admin-components/Header"

export default function EWasteSubmit() {
    return (
        <>
            <AdminSidebar />
            <div className="admin-container">
                <Header 
                    pageTitle="E-Waste Submission Validation" 
                    adminName="Admin Name" 
                  />
            </div>
        </>
    )
}