import React from 'react';
// import styles from './page.module.css';

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
    <div>
      <h1 className='text-3xl font-bold'>Hello world!</h1>

      <div>{asyncData}</div>
    </div>
  );
}
