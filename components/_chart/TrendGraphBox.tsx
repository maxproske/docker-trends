import { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useImagePulls } from 'services/queries';
import TrendGraph from './TrendGraph';

export const djsToStartDate = (djs) => djs.startOf('week').format('YYYY-MM-DD');

const propTypes = {
  packets: PropTypes.arrayOf(PropTypes.object).isRequired,
  colors: PropTypes.arrayOf(PropTypes.array).isRequired,
  packageDownloadData: PropTypes.arrayOf(PropTypes.object),
};

const TrendGraphBox = ({ packets, colors, packageDownloadData }) => {
  const [startDate, setStartDate] = useState(djsToStartDate(dayjs().subtract(12, 'months')));
  const endDate = dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD');

  const { data: graphStats } = useImagePulls(packets, startDate, endDate, packageDownloadData);

  const handlePeriodChange = (e) => {
    setStartDate(e.target.value);
  };

  const heading = () => {
    const selectOptionsData = [
      ['1 Month', djsToStartDate(dayjs().subtract(1, 'month'))],
      ['3 Months', djsToStartDate(dayjs().subtract(3, 'month'))],
      ['6 Months', djsToStartDate(dayjs().subtract(6, 'month'))],
      ['1 Year', djsToStartDate(dayjs().subtract(1, 'year'))],
      ['2 Years', djsToStartDate(dayjs().subtract(2, 'year'))],
      ['5 Years', djsToStartDate(dayjs().subtract(5, 'year'))],
      ['All time', djsToStartDate(dayjs('2015-01-10'))],
    ];
    const selectOptions = selectOptionsData.map((option) => (
      <option key={option[1]} value={option[1]}>
        {option[0]}
      </option>
    ));
    return (
      <h2 className="chart-heading">
        Weekly pulls <span className="text--light">in past 2 months <span style={{fontSize: 10}}>(Custom dates coming soon)</span></span>
        {/* <span className="select-container">
          <select className="chart-heading-select" value={startDate} onChange={handlePeriodChange}>
            {selectOptions}
          </select>
        </span> */}
      </h2>
    );
  };

  return (
    <div>
      {heading()}
      <TrendGraph graphStats={graphStats} colors={colors} />
    </div>
  );
};

TrendGraphBox.propTypes = propTypes;

export default TrendGraphBox;
