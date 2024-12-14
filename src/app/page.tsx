import LogoutButton from '@/components/LogoutButton';
import React from 'react';

interface PokemonApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export default async function Home(): Promise<React.ReactElement> {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon', {
    // cache: 'no-store',
    // next: {
    // revalidate: 10,
    // },
  });
  const data: PokemonApiResponse = await response.json();

  const asyncData = JSON.stringify(data);

  return (
    <div className='relative min-h-screen p-8'>
      <LogoutButton />
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Hello world!</h1>
        <div className='bg-card p-6 rounded-lg shadow'>
          <pre className='whitespace-pre-wrap'>{asyncData}</pre>
        </div>
      </div>
    </div>
  );
}
