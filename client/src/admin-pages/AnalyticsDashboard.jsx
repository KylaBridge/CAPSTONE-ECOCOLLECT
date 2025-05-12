import AdminSidebar from "../admin-components/AdminSidebar"
import Header from "../admin-components/Header"
import UserParticipationChart from "../admin-components/UserParticipationChart";
import EwasteCollectedChart from '../admin-components/EwasteCollectedChart';
import RewardRedemptionChart from "../admin-components/RewardRedemptionChart";
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
             <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <UserParticipationChart />
                    </div>

                    <div className="dashboard-card">
                        <EwasteCollectedChart />
                    </div>

                    <div className="dashboard-card span-2">
                        <RewardRedemptionChart />
                    </div>
                </div>
        </div>
         
        </>
    )
}