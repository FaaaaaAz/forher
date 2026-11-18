import stylist from '../../assets/cosecha/estilista.webp';

// El estilista junto al buzón, saliendo de la penumbra.
export default function StylistCameo() {
  return (
    <figure className="stylist-cameo">
      <img src={stylist} width="863" height="1024" alt="El estilista, mirando hacia el buzón" loading="lazy" decoding="async" />
    </figure>
  );
}
