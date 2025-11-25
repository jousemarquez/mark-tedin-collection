import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [cards, setCards] = useState([]);
  const [ownedCards, setOwnedCards] = useState(() => {
    const stored = localStorage.getItem("ownedCards");
    return stored ? JSON.parse(stored) : {};
  });
  const [search, setSearch] = useState("");
  const [loadedImages, setLoadedImages] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
  fetch("/cards.txt")
    .then((res) => res.text())
    .then((text) => {
      const cardNames = text
        .split("\n")
        .map((name) => name.trim())
        .filter((n) => n.length > 0);
      setCards(cardNames);
    });
}, []);

  useEffect(() => {
    localStorage.setItem("ownedCards", JSON.stringify(ownedCards));
  }, [ownedCards]);

  useEffect(() => {
    if (cards.length === 0) return;

    let loaded = 0;
    const total = cards.length;

    cards.forEach((card) => {
      fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(card)}`)
        .then((res) => res.json())
        .then((data) => {
          setLoadedImages((prev) => ({
            ...prev,
            [card]: data.image_uris?.normal || data.image_uris?.small || "",
          }));
          loaded++;
          setLoadingProgress(Math.round((loaded / total) * 100));
        })
        .catch(() => {
          loaded++;
          setLoadingProgress(Math.round((loaded / total) * 100));
        });
    });
  }, [cards]);

  const toggleOwned = (card) => {
    setOwnedCards((prev) => ({
      ...prev,
      [card]: !prev[card],
    }));
  };

  const filteredCards = cards.filter((card) =>
    card.toLowerCase().includes(search.toLowerCase())
  );

  const totalOwned = Object.values(ownedCards).filter(Boolean).length;

  // Pagination logic
  const totalPages = Math.ceil(filteredCards.length / pageSize);
  const pageCards = filteredCards.slice((page - 1) * pageSize, page * pageSize);

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="container">
      <h1>Mark Tedin Collection</h1>

      <div className="stats">
        <p>
          Owned: {totalOwned} / {cards.length}
        </p>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${(totalOwned / cards.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search cards..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      {loadingProgress < 100 && (
        <p className="loading">Loading images... {loadingProgress}%</p>
      )}

      <div className="card-grid">
        {pageCards.length === 0 ? (
          <p className="no-results">No cards found.</p>
        ) : (
          pageCards.map((card) => {
            const owned = ownedCards[card];
            const image = loadedImages[card];

            return (
              <div
                key={card}
                className={`card ${owned ? "owned" : "missing"}`}
                onClick={() => toggleOwned(card)}
              >
                {image ? (
                  <img src={image} alt={card} />
                ) : (
                  <div className="placeholder">Loading...</div>
                )}
                <div className="card-footer">
                  <label>
                    <input
                      type="checkbox"
                      checked={owned || false}
                      onChange={() => toggleOwned(card)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {card}
                  </label>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {filteredCards.length > pageSize && (
        <div className="pagination">
          <button onClick={prevPage} disabled={page === 1}>
            ← Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button onClick={nextPage} disabled={page === totalPages}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
