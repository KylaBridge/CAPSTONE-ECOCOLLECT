function getRank(points) {
    if (points >= 700) return "E-Waste Guardian";
    if (points >= 600) return "Earth Ally";
    if (points >= 500) return "Green Ethusiast";
    if (points >= 400) return "Eco Learner";
    if (points >= 300) return "Recycling Rookie";
    if (points >= 200) return "Green Beginner";
    if (points >= 100) return "Eco Novice";
    return "Eco Starter";
}

module.exports = { getRank };