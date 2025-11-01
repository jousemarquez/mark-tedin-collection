import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [cards, setCards] = useState([]);
  const [collection, setCollection] = useState({});
  const [filter, setFilter] = useState("all"); // all | have | not-have
  const [progress, setProgress] = useState(0);
  const [cardImages, setCardImages] = useState({});

  // Carga inicial
  useEffect(() => {
    fetch("/cards.txt")
      .then((res) => res.text())
      .then((text) => {
        const list = text.split("\n").map((line) => line.trim()).filter(Boolean);
        setCards(list);
      });

    const saved = JSON.parse(localStorage.getItem("tedinCollection")) || {};
    setCollection(saved);
  }, []);

  // Actualiza progreso
  useEffect(() => {
    const haveCount = Object.values(collection).filter(Boolean).length;
    const total = cards.length;
    setProgress(total > 0 ? Math.round((haveCount / total) * 100) : 0);
  }, [collection, cards]);

  // Toggle de cartas
  const toggleHave = (card) => {
    const updated = { ...collection, [card]: !collection[card] };
    setCollection(updated);
    localStorage.setItem("tedinCollection", JSON.stringify(updated));
  };

  // Carga imágenes desde Scryfall
  useEffect(() => {
    async function fetchImages() {
      const newImages = {};
      for (const card of cards) {
        if (!cardImages[card]) {
          try {
            const res = await fetch(
              `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(card)}`
            );
            const data = await res.json();
            if (data?.image_uris?.normal) {
              newImages[card] = data.image_uris.normal;
            } else if (data?.card_faces?.[0]?.image_uris?.normal) {
              newImages[card] = data.card_faces[0].image_uris.normal;
            }
          } catch {
            newImages[card] = null;
          }
        }
      }
      setCardImages((prev) => ({ ...prev, ...newImages }));
    }
    if (cards.length > 0) fetchImages();
  }, [cards]);

  // Filtro de visualización
  const filteredCards = cards.filter((card) => {
    if (filter === "have") return collection[card];
    if (filter === "not-have") return !collection[card];
    return true;
  });

  return (
    <div className="app">
      <header>
        <h1>Mark Tedin Collection</h1>
        <div className="stats">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <p>{progress}% ({Object.values(collection).filter(Boolean).length}/{cards.length})</p>
        </div>

        <div className="filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            Todas
          </button>
          <button
            className={filter === "have" ? "active" : ""}
            onClick={() => setFilter("have")}
          >
            Tengo
          </button>
          <button
            className={filter === "not-have" ? "active" : ""}
            onClick={() => setFilter("not-have")}
          >
            No tengo
          </button>
        </div>
      </header>

      <main className="grid">
        {filteredCards.map((card) => {
          const have = collection[card];
          const image = cardImages[card];
          return (
            <div
              key={card}
              className={`card ${have ? "have" : "not-have"}`}
              onClick={() => toggleHave(card)}
            >
              {image ? (
                <img src={image} alt={card} />
              ) : (
                <div className="placeholder">Sin imagen</div>
              )}
              <div className="card-info">
                <h2>{card}</h2>
                <label>
                  <input
                    type="checkbox"
                    checked={!!have}
                    onChange={() => toggleHave(card)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  Tengo
                </label>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
