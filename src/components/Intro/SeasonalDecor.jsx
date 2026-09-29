export default function SeasonalDecor({ season }) {
  return (
    <div className={`seasonal-decor seasonal-decor--${season.id}`} aria-hidden="true">
      {Array.from({ length: 7 }, (_, index) => (
        <span className={`seasonal-decor__item seasonal-decor__item--${index + 1}`} key={index}>
          <span className={`seasonal-motif seasonal-motif--${season.motif}`} />
        </span>
      ))}
    </div>
  );
}
