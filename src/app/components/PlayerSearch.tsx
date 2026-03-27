'use client';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';

export const PlayerSearch = () => {
  const [rioterQuery, setRioterQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
    });

    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    const trimmed = rioterQuery.trim();
    if (trimmed.length < 3) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/suggestions?q=${encodeURIComponent(trimmed)}`,
          {
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' }
          }
        );
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setIsOpen(true);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [rioterQuery]);

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
              onChange={(e) => {
                const next = e.target.value;
                setRioterQuery(next);
                if (next.trim().length < 3) {
                  setSuggestions([]);
                  setIsOpen(false);
                }
              }}
              onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            />
            {isOpen && suggestions.length > 0 && (
              <motion.ul className='bg-white border border-gray-300 rounded mt-1'>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className='p-2 hover:bg-gray-200 cursor-pointer'
                    onMouseDown={() => {
                      setRioterQuery(suggestion);
                      setIsOpen(false);
                      onPlayerSearch();
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </motion.ul>
            )}
            <Button type='submit'> Search</Button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};
