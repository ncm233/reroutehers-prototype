import { Link } from 'react-router-dom';
import logoWebp from '../../assets/logo-full.webp';
import logoPng from '../../assets/logo-full.png';

export default function Header() {
  return (
    <header className="px-6 pt-6 sm:px-10 sm:pt-8">
      <Link
        to="/"
        aria-label="ReRouteHer — new paths, still you — home"
        className="inline-block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
      >
        <picture>
          <source srcSet={logoWebp} type="image/webp" />
          <img
            src={logoPng}
            alt="ReRouteHer — new paths, still you"
            width={752}
            height={192}
            className="h-11 w-auto sm:h-13"
          />
        </picture>
      </Link>
    </header>
  );
}
