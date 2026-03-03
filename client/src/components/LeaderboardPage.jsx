import "./styles/LeaderboardPage.css";
import { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { UserContext } from "../context/userContext";
import { userAPI } from "../api/user";
import HomeHeaderTitle from "../assets/headers/home-header.png";

const PODIUM_STYLES = [
  { heightClass: "podium-second", label: "2ND", crownColor: "#c0c0c0" },
  { heightClass: "podium-first",  label: "1ST", crownColor: "#ffd700" },
  { heightClass: "podium-third",  label: "3RD", crownColor: "#cd7f32" },
];

const RANK_BADGE_COLOR = {
  "Eco Novice":     "#78c850",
  "Eco Apprentice": "#48d0b0",
  "Eco Warrior":    "#4890f0",
  "Eco Champion":   "#f8a130",
  "Eco Legend":     "#f85888",
};

function Avatar({ user, size = 48, className = "" }) {
  const initial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "?";

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt="avatar"
        className={`lb-avatar-img ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`lb-avatar-initial ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initial}
    </div>
  );
}

export default function LeaderboardPage() {
  const [showNavbar, setShowNavbar] = useState(false);
  const { user } = useContext(UserContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    userAPI
      .getLeaderboards()
      .then((res) => {
        if (Array.isArray(res.data)) {
          const sorted = [...res.data]
            .filter((u) => u && typeof u === "object")
            .sort((a, b) => (b.exp || 0) - (a.exp || 0));
          setLeaderboard(sorted.slice(0, 10));
          const idx = sorted.findIndex((u) => u._id === user?._id);
          setUserRank(idx !== -1 ? idx + 1 : null);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Display order for podium: 2nd · 1st · 3rd
  const podiumOrder = [
    { entry: top3[1], podiumIdx: 0 },
    { entry: top3[0], podiumIdx: 1 },
    { entry: top3[2], podiumIdx: 2 },
  ];

  const isCurrentUser = (entry) => entry?._id === user?._id;

  return (
    <div className="body-leaderboard-module">
      <Sidebar isShown={showNavbar} setIsShown={setShowNavbar} />
      <Header headerImg={HomeHeaderTitle} headerText="Leaderboard" />

      <div className="lb-main-container">
        {/* ── Title ── */}
        <div className="lb-title-row">
          <span className="lb-trophy">🏆</span>
          <h1 className="lb-title">TOP PLAYERS</h1>
          <span className="lb-trophy">🏆</span>
        </div>

        {userRank && (
          <div className="lb-your-rank">
            <span>Your Rank:</span>
            <span className="lb-your-rank-num">#{userRank}</span>
          </div>
        )}

        {loading ? (
          <div className="lb-loading">
            <div className="lb-spinner" />
            <p>Loading champions…</p>
          </div>
        ) : (
          <>
            {/* ── Podium (top 3) ──
             {top3.length > 0 && (
              <div className="lb-podium-wrapper">
                {podiumOrder.map(({ entry, podiumIdx }) => {
                  if (!entry) return <div key={podiumIdx} className="lb-podium-slot" />;
                  const { heightClass, label, crownColor } = PODIUM_STYLES[podiumIdx];
                  const realRank = podiumIdx === 1 ? 1 : podiumIdx === 0 ? 2 : 3;
                  return (
                    <div
                      key={entry._id}
                      className={`lb-podium-slot ${
                        isCurrentUser(entry) ? "lb-podium-me" : ""
                      }`}
                    >
                      {realRank === 1 && (
                        <span className="lb-crown">👑</span>
                      )}
                      <Avatar user={entry} size={54} className="lb-podium-avatar" />
                      <p className="lb-podium-name">
                        {entry.name || entry.email?.split("@")[0]}
                      </p>
                      <p className="lb-podium-exp">{(entry.exp || 0).toLocaleString()} XP</p>
                      <div className={`lb-podium-block ${heightClass}`}>
                        <span
                          className="lb-podium-medal"
                          style={{ color: crownColor }}
                        >
                          {label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )} */}

            {/* ── Rank list (4–10) ── */}
            {rest.length > 0 && (
              <div className="lb-list">
                {rest.map((entry, idx) => {
                  const rank = idx + 4;
                  const rankColor =
                    RANK_BADGE_COLOR[entry.rank] || "#8dd7d7";
                  return (
                    <div
                      key={entry._id}
                      className={`lb-row ${
                        isCurrentUser(entry) ? "lb-row-me" : ""
                      }`}
                      style={{ animationDelay: `${idx * 0.07}s` }}
                    >
                      <span className="lb-row-rank">#{rank}</span>
                      <Avatar user={entry} size={44} />
                      <div className="lb-row-info">
                        <span className="lb-row-name">
                          {entry.name || entry.email?.split("@")[0]}
                        </span>
                        <span className="lb-row-exp">
                          {(entry.exp || 0).toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {leaderboard.length === 0 && (
              <div className="lb-empty">
                <p>No players yet. Be the first!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
