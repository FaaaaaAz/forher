const flowers = [
  { x: '22%', rise: '130px', tilt: '-29deg', size: '56px', delay: '.25s' },
  { x: '33%', rise: '167px', tilt: '-17deg', size: '64px', delay: '.5s' },
  { x: '50%', rise: '205px', tilt: '0deg', size: '76px', delay: '.75s' },
  { x: '68%', rise: '167px', tilt: '17deg', size: '64px', delay: '1s' },
  { x: '78%', rise: '130px', tilt: '29deg', size: '56px', delay: '1.25s' },
];

export default function Seedling() {
  return (
    <div className="seedling bouquet" role="img" aria-label="Un ramo de cinco girasoles que crecen juntos">
      <span className="seedling__light" aria-hidden="true" />
      {flowers.map((flower, index) => (
        <span className="bouquet__flower" key={index} style={{ '--x': flower.x, '--rise': flower.rise, '--tilt': flower.tilt, '--size': flower.size, '--delay': flower.delay }} aria-hidden="true">
          <span className="bouquet__stem" />
          <span className="bouquet__bloom"><span className="bouquet__head">{Array.from({ length: 8 }, (_, petal) => <i key={petal} />)}<b /></span></span>
        </span>
      ))}
      <span className="seedling__ground" aria-hidden="true" />
    </div>
  );
}
