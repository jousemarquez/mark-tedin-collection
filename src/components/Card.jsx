export default function Card({ card, owned, image, toggleOwned }) {
  return (
    <div className={`card ${owned ? "owned" : "missing"}`} onClick={() => toggleOwned(card)}>
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
}
