import avif from '../../assets/hero-dreamy-butterfly.avif';
import webp from '../../assets/hero-dreamy-butterfly.webp';
import jpg from '../../assets/hero-dreamy-butterfly.jpg';

/**
 * Hero illustration. Dimensions are explicit so the image reserves its space
 * and does not shift the headline while loading.
 */
export default function HeroArt({ className = '' }) {
  return (
    <picture>
      <source srcSet={avif} type="image/avif" />
      <source srcSet={webp} type="image/webp" />
      <img
        src={jpg}
        alt=""
        width={764}
        height={1024}
        fetchPriority="high"
        decoding="async"
        className={className}
      />
    </picture>
  );
}
