export default function Seedling() {
  return (
    <div className="seedling" role="img" aria-label="Una flor amarilla creciendo">
      <span className="seedling__light" />
      <span className="seedling__stem" />
      <span className="seedling__leaf seedling__leaf--left" />
      <span className="seedling__leaf seedling__leaf--right" />
      <span className="seedling__flower">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}<b /></span>
      <span className="seedling__seed" />
      <span className="seedling__ground" />
    </div>
  );
}
