import "./styles/RewardsContainer.css"
import RewardsData from "../RewardsData"

export default function RewardsContainer(props) {
    
    return (
        <div className="rewards-container">
            <img src={props.rewardsImg} />
            <div className="price-container">
                <h2>{props.rewardsPrice}</h2>
            </div>
        </div>
    )
}