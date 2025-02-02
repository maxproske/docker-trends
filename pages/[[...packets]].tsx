import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import IPackage from 'types/IPackage';
import API from 'services/API';
import Package from 'services/Package';
import { getPacketNamesFromQuery, searchPathToDisplayString, getCanonical } from 'utils/url';
import { hasNavigationCSR } from 'utils/hasNavigationCSR';

import AppHead from 'components/_templates/AppHead';
import Layout from 'components/_templates/Layout';
import PackageComparison from 'components/PackageComparison';
import Fetch from 'services/Fetch';
import { usePackagesData } from 'services/queries';
// import PackageDownloads from 'services/PackageDownloads';
import { djsToStartDate } from 'components/_chart/TrendGraphBox';
import ImagePulls from 'services/ImagePulls'

const fetchPageData = async (packets) => {
  if (!packets.length) {
    return { packets: [] };
  }

  const { validPackages } = await Package.fetchPackages(packets);
  const maxPacketsForSearch = 10;
  return { packets: validPackages.slice(0, maxPacketsForSearch) };
};

type Props = {
  initialData: {
    packets: IPackage[];
  };
  popularSearches: string[];
  packageDownloadData: any[];
};

function generateDescription(packets: IPackage[]) {
  const str = packets
    .map(
      (packet) =>
        `${packet.name} ${packet.version} which has ${packet.downloads.weekly.toLocaleString(
          'en-US',
        )} weekly downloads and ${
          packet?.github?.starsCount?.toLocaleString('en-US') || 'unknown number of'
        } GitHub stars`,
    )
    .join(' vs. ');

  return `Comparing trends for ${str}.`;
}

export const getServerSideProps = hasNavigationCSR(async ({ query, res, req }) => {
  const packetNames = getPacketNamesFromQuery(query);

  // TODO: Copy same functionality for Docker
  // if (req.url !== getCanonical(packetNames)) {
  //   return {
  //     redirect: {
  //       permanent: true,
  //       destination: getCanonical(packetNames),
  //     },
  //   };
  // }

  const startDate = djsToStartDate(dayjs().subtract(12, 'months'));
  const endDate = dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD');


  const [pageData, popularSearches, packageDownloadData] = await Promise.all([
    fetchPageData(packetNames),
    Fetch.getJSON('/s/searches?limit=10'),
    Promise.all(packetNames.map((name) => ImagePulls.fetchDownloads(name, startDate, endDate))),
  ]);

  // If error with any packages, remove errored packages from url
  if (pageData.packets && packetNames.length !== pageData.packets.length) {
    const packetsUrlParam = pageData.packets.map((p) => p.name).join('-vs-');

    // TODO: Copy same functionality for Docker
    // return {
    //   redirect: {
    //     permanent: false,
    //     destination: `/${packetsUrlParam}`,
    //   },
    // };
  }

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  return {
    props: {
      initialData: pageData,
      packageDownloadData,
      popularSearches: popularSearches.map((searchQuery) => searchQuery.slug.split('_').join('-vs-')),
    },
  };
});

const Packets = ({ initialData, popularSearches: initialSearches, packageDownloadData }: Props) => {
  const [popularSearches] = useState(initialSearches);
  const { query } = useRouter();
  const packetNames = useMemo(() => getPacketNamesFromQuery(query), [query]);
  const { data } = usePackagesData(packetNames, initialData);
  const { packets } = data;

  useEffect(() => {
    // Log search
    if (packets.length) {
      const packetsArray = packets.map((p) => p.name);
      API.logSearch(packetsArray, 'view');
    }
  }, [packets]);

  const canonical = packetNames ? getCanonical(packetNames) : undefined;
  let pageTitle = 'Docker Trends: Compare Docker image pulls';
  let pageDescription =
    'Which Docker image should you choose? Compare weekly pull stats and pick the winner.';

  if (packetNames.length) {
    const packetsString = searchPathToDisplayString(packetNames);
    pageTitle = `${packetsString} | Docker Trends`;
    // pageDescription = generateDescription(packets);
  }

  return (
    <>
      <AppHead title={pageTitle} description={pageDescription} canonical={canonical} />
      <Layout>
        <PackageComparison
          packageDownloadData={packageDownloadData}
          popularSearches={popularSearches}
          packets={packets}
          packetNames={packetNames}
        />
      </Layout>
    </>
  );
};

export default Packets;
