export default function SeasonalDecor({ season }) {
  return (
    <div className={`seasonal-decor seasonal-decor--${season.id}`} aria-hidden="true">
      {Array.from({ length: 7 }, (_, index) => (
        <span className={`seasonal-decor__item seasonal-decor__item--${index + 1}`} key={index}>
          <span className={`seasonal-motif seasonal-motif--${season.id === 'yellow-flowers' ? ([1, 5].includes(index) ? 'heart' : [2, 6].includes(index) ? 'red-flower' : 'flower') : season.motif}`}>
            {season.motif === 'flower' && Array.from({ length: 5 }, (_, petal) => <i key={petal} />)}
          </span>
        </span>
      ))}
    </div>
  );
}
