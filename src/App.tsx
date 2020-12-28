import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {ApolloProvider, ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { Brand } from './models/brand.model';


const client = new ApolloClient({
  uri: 'https://openapi.radiofrance.fr/v1/graphql?x-token=5de3274b-5596-49b5-9b64-a3ddf064502a',
  cache: new InMemoryCache()
});

const BRANDS_QUERY = gql`
  query getBrands {
    brands {
      id
      title
      baseline
      description
      websiteUrl
      liveStream
    }
  }
`;

function RadioFranceBrands() {
  const {loading, error, data } = useQuery(BRANDS_QUERY);
  const [currentRadio, setRadio] = useState<Brand>();
  let audioLector;

  if (loading) return <p>Loading ...</p>
  if (error) return <p>Error !</p>
  
  if (currentRadio) {
    audioLector = 
    <div>
      <p>La radio écoutée est : {currentRadio?.title} </p>
      <audio controls src={currentRadio?.liveStream} autoPlay></audio>
    </div>
  }

  return (
    <div>
      <ul>
        {
          data.brands.map((brand: Brand) => (
            <div key={brand.id} onClick={() => setRadio(brand)} >
              <p>
                {brand.title}: {brand.description}
              </p>
            </div>
          ))
        }
      </ul>
      {audioLector}
    </div>
  )
}

function RadioAudio() {
  return (
    <audio controls src=""></audio>
  )
}


function App() {
  const [urlRadio, setUrlRadio] = useState("");

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <RadioFranceBrands></RadioFranceBrands>
      </div>
    </ApolloProvider>
  );
}

export default App;
