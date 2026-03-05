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
          // Server returns pre-sorted, filtered results — just slice top 10
          const top10 = res.data.slice(0, 10);
          setLeaderboard(top10);
          const idx = res.data.findIndex((u) => u._id === user?._id);
          setUserRank(idx !== -1 ? idx + 1 : null);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const isCurrentUser = (entry) => entry?._id === user?._id;

  const RANK_MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };

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

        {user && (
          <div className="lb-your-rank">
            <span>Your Rank:</span>
            {userRank ? (
              <span className="lb-your-rank-num">#{userRank}</span>
            ) : (
              <span className="lb-your-rank-num">Unlisted</span>
            )}
            {user?.rank && user.rank !== "Unranked" && (
              <>
                <span className="lb-your-rank-divider">·</span>
                <span className="lb-rank-badge">{user.rank}</span>
              </>
            )}
          </div>
        )}

        {loading ? (
          <div className="lb-loading">
            <div className="lb-spinner" />
            <p>Loading champions…</p>
          </div>
        ) : (
          <>
            {/* ── Rank list (Top 10) ── */}
            {leaderboard.length > 0 && (
              <div className="lb-list">
                {leaderboard.map((entry, idx) => {
                  const rank = idx + 1;
                  return (
                    <div
                      key={entry._id}
                      className={`lb-row ${
                        isCurrentUser(entry) ? "lb-row-me" : ""
                      }`}
                      style={{ animationDelay: `${idx * 0.07}s` }}
                    >
                      <span className="lb-row-rank">
                        {RANK_MEDAL[rank] ?? `#${rank}`}
                      </span>
                      <Avatar user={entry} size={44} />
                      <div className="lb-row-info">
                        <div className="lb-row-top">
                          <span className="lb-row-name">
                            {entry.name || entry.email?.split("@")[0] || "Unknown Player"}
                          </span>
                          {entry.rank && entry.rank !== "Unranked" && (
                            <span className="lb-rank-badge" >
                              {entry.rank}
                            </span>
                          )}
                        </div>
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
