import type { NextApiRequest, NextApiResponse } from 'next'
import Fetch from '../../services/Fetch';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const name = req.query.name as string

  const namespace = name.split('/').length === 1 ? 'library' : name.split('/')[0]
  const repo = name.split('/').length === 1 ? name.split('/')[0] : name.split('/')[1]


  const data = await Fetch.getJSON(`https://hub.docker.com/api/publisher/proxylytics/v1/namespaces/${namespace}/repos/${repo}/pulls`);

  const downloads = data.pulls.map((pull) => {

    return {
      downloads: pull.pullCount,
      day: dayjs(pull.start).utc().format('YYYY-MM-DD')
    }
  })

  res.status(200).json(downloads)
}