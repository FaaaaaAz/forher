export default function SeasonalDecor({ season }) {
  return (
    <div className={`seasonal-decor seasonal-decor--${season.id}`} aria-hidden="true">
      {Array.from({ length: 7 }, (_, index) => (
        <span className={`seasonal-decor__item seasonal-decor__item--${index + 1}`} key={index}>
          <span className={`seasonal-motif seasonal-motif--${season.id === 'yellow-flowers' && (index === 1 || index === 5) ? 'heart' : season.motif}`}>
            {season.motif === 'flower' && Array.from({ length: 5 }, (_, petal) => <i key={petal} />)}
          </span>
        </span>
      ))}
    </div>
  );
}
