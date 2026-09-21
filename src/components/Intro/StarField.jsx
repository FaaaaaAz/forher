const stars = Array.from({ length: 48 }, (_, index) => ({
  id: index,
  x: (index * 73.37 + 17) % 100,
  y: (index * 41.89 + 9) % 100,
  delay: (index * 0.63) % 6,
  size: index % 7 === 0 ? 3 : 2,
}));

export default function StarField() {
  return (
    <div className="star-field" aria-hidden="true">
      {stars.map((star) => (
        <span
          className="star"
          key={star.id}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
