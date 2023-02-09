import Link from 'next/link';

const Header = () => (
  <header>
    <div className="container">
      <Link href="/[[...packets]]" as="/">
        <a className="site-logo">
          <img
            width={96}
            height={96}
            className="site-logo--img"
            alt="Docker Trends Logo"
            src="/img/favicon.png"
          />
          <span className="site-logo--name">Docker Trends</span>
        </a>
      </Link>
    </div>
  </header>
);

export default Header;
