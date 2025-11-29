import React, { useState, useEffect } from "react";

export default function Home() {
  const [cards, setCards] = useState([]);
  const [ownedCards, setOwnedCards] = useState({});
  const [search, setSearch] = useState("");
  const [loadedImages, setLoadedImages] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  // Cargar lista de cartas desde txt
  useEffect(() => {
    fetch("/cards.txt")
      .then((res) => res.text())
      .then((text) => {
        const cardNames = text
          .split("\n")
          .map((name, idx) => ({ id: idx + 1, name: name.trim() }))
          .filter((n) => n.name.length > 0);
        setCards(cardNames);
      });
  }, []);

  // Cargar colección desde MongoDB
  useEffect(() => {
    fetch("/api/getOwnedCards")
      .then((res) => res.json())
      .then((data) => {
        setOwnedCards(data.ownedCards || {});
      });
  }, []);

  // Guardar colección localmente al cambiar
  useEffect(() => {
    localStorage.setItem("ownedCards", JSON.stringify(ownedCards));
  }, [ownedCards]);

  // Cargar imágenes desde Scryfall
  useEffect(() => {
    if (cards.length === 0) return;

    let loaded = 0;
    const total = cards.length;

    cards.forEach((card) => {
      fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(card.name)}`)
        .then((res) => res.json())
        .then((data) => {
          setLoadedImages((prev) => ({
            ...prev,
            [card.name]: data.image_uris?.normal || data.image_uris?.small || "",
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

  const toggleOwned = (cardName) => {
    setOwnedCards((prev) => ({
      ...prev,
      [cardName]: !prev[cardName],
    }));
  };

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalOwned = Object.values(ownedCards).filter(Boolean).length;

  // Guardar en MongoDB
  const saveCollection = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/saveOwnedCards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownedCards }),
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Error saving collection");
    } finally {
      setSaving(false);
    }
  };

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
        <button className="save-button" onClick={saveCollection} disabled={saving}>
          {saving ? "Saving..." : "Save Collection"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Search cards..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      {loadingProgress < 100 && <p className="loading">Loading images... {loadingProgress}%</p>}

      <div className="card-grid">
        {filteredCards.length === 0 ? (
          <p className="no-results">No cards found.</p>
        ) : (
          filteredCards.map((card) => {
            const owned = ownedCards[card.name];
            const image = loadedImages[card.name];

            return (
              <div
                key={card.id}
                className={`card ${owned ? "owned" : "missing"}`}
                onClick={() => toggleOwned(card.name)}
              >
                {image ? (
                  <img src={image} alt={card.name} />
                ) : (
                  <div className="placeholder">Loading...</div>
                )}
                <div className="card-footer">
                  <label>
                    <input
                      type="checkbox"
                      checked={owned || false}
                      onChange={() => toggleOwned(card.name)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {card.id}. {card.name}
                  </label>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
