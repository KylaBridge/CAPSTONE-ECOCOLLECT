import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/BadgeTable.css";

export default function BadgeTable() {
    const [badges, setBadges] = useState([]);

    const placeholderBadges = [
        { id: "BDG001", name: "Eco Hero", points: 10 },
        { id: "BDG002", name: "Tree Planter", points: 20 },
        { id: "BDG003", name: "Waste Warrior", points: 15 },
        { id: "B45667", name: "BEGINNER", points: 15 },
        { id: "B45667", name: "BEGINNER", points: 15 },
    ];

    useEffect(() => {
        /*
        axios.get('/api/badges')
            .then((response) => {
                setBadges(response.data);
            })
            .catch((error) => {
                toast.error("Failed to fetch badges");
                console.error("Error fetching badges:", error);
            });
        */

        // TEMP: Set placeholder for development
        setBadges(placeholderBadges);
    }, []);
  
    return (
      <div className="badgetable-container">
         <div className="badge-table-header">
            <div className="left-controls">
                <select className="sort-dropdown">
                <option value="">Sort By</option>
                <option value="name">Name</option>
                <option value="points">Points</option>
                </select>
            </div>

            <h2 className="badge-title">Badges</h2>

            <div className="right-controls">
                <button className="add-button">Add Badge</button>
          </div>
        </div>

        <div className="badge-table-wrapper">
            <table className="badge-table">
                <thead>
                <tr>
                    <th>Badge ID</th>
                    <th>Badge Name</th>
                    <th>Points Required</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody className="badge-table-body">
                {badges.map((badge) => (
                    <tr key={badge.id}>
                    <td>{badge.id}</td>
                    <td>{badge.name}</td>
                    <td>{badge.points}</td>
                    <td><button>VIEW</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
      </div>
    );
  }
  
