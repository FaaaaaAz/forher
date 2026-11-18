import couple from '../../assets/cosecha/pareja.webp';

// Fondo de la portada en los días de la película: la imagen tal cual, con los bordes
// fundiéndose en la oscuridad, como si saliera de la sombra.
export default function CoupleBackdrop() {
  return (
    <div className="couple-backdrop" aria-hidden="true">
      <img src={couple} alt="" decoding="async" fetchPriority="high" />
    </div>
  );
}
