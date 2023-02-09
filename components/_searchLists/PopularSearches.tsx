import Link from 'next/link';

const PopularSearches = ({ popularSearches: searches }: { popularSearches: string[] }) => {
  searches = ['busybox-vs-alpine-vs-ubuntu-vs-debian', 'postgres-vs-mysql-vs-mariadb', 'node-vs-openjdk-vs-php', 'nginx-vs-httpd', 'wordpress-vs-ghost-vs-drupal']

  const renderSearchesList = () =>
    searches.map((search) => {
      const href = `/${search}`;
      const searchPacketsArray = search.split('-vs-');
      const packetNames = searchPacketsArray.map((name, i) => (
        <span key={name}>
          <span className="text--bold">{name}</span>
          {searchPacketsArray.length - 1 !== i && ' vs '}
        </span>
      ));
      return (
        <li key={search}>
          <Link href="/[[...packets]]" as={href}>
            <a title={searchPacketsArray.join(' vs ')}>{packetNames}</a>
          </Link>
        </li>
      );
    }, this);

  if (!searches?.length) return null;

  return (
    <div className="suggetions--box">
      <h2>Popular Searches</h2>
      <ul className="suggestions-list list-unstyled">{renderSearchesList()}</ul>
    </div>
  );
};

export default PopularSearches;
