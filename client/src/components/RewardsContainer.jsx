import "./styles/RewardsContainer.css";

export default function RewardsContainer(props) {
  const handleClick = () => {
    props.onRewardClick(props.reward);
  };

  return (
    <div className="rewards-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="image-container">
        <img src={props.reward.img} alt={props.reward.name} /> 
      </div>
      <div className="details-container">
        <h3 className="reward-name">{props.reward.name}</h3>
        <p className="reward-points">{props.reward.price} points</p>
      </div>
    </div>
  );
}