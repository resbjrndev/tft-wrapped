'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { processPlayerStats } from '../lib/stats.processor';

export const PlayerSearch = () => {
  const [rioterQuery, setRioterQuery] = useState<string>('');
  const [matches, setMatches] = useState<any>(null);


  const onPlayerSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const [rawGameName = '', rawTagLine = ''] = rioterQuery.split('#', 2);
    const gameName = rawGameName.trim();
    const tagLine = rawTagLine.trim();
    console.log('triggered');
    const response = await fetch('/api/wrapped', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameName: gameName, tagLine: tagLine })
    }).catch((error) => {

      console.error('Fetch error:', error);
    });

    if (!response) return;

    const data = await response.json();


    console.log(" PLAYER DATA", data);
    setMatches(data);
    processPlayerStats(data.matches, data.account.puuid)
  };

  return (
    <motion.div className='flex flex-col'>
      <div className='flex flex-col'>
        <h1 className='text-xl'>Seach for Player </h1>

        <motion.div className='flex flex-col'>
          <form onSubmit={onPlayerSearch}>
            <input
              className='bg-grey'
              name='gameName'
              type='text'
              placeholder='Game Name'
              value={rioterQuery}
              onChange={(e) => setRioterQuery(e.target.value)}
            />
            <Button type='submit'> Search</Button>
          </form>
        </motion.div>



      </div>


      <pre>
        {matches ? JSON.stringify(matches.account, null, 2) : 'No matches found'}
      </pre>
    </motion.div>
  );
};
