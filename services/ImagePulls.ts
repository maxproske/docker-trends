import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { npmDownloadsURL } from 'utils/proxy';
import Fetch from './Fetch';

dayjs.extend(duration)

class ImagePulls {
  static fetchDownloads = async (packageName, startDate, endDate) => {
  
    const data = await Fetch.getJSON(`http://localhost:3000/api/docker?name=${packageName}`);

    return {
      package: packageName,
      downloads: data
    }
  };
}

export default ImagePulls;
