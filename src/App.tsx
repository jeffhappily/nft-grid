import React, { useState, useEffect } from "react";
import NftCard, { Nft } from "./NftCard";
import NftModal from "./NftModal";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [selectedNft, setSelectedNft] = useState<Nft | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(
    "0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b"
  );
  const [cursor, setCursor] = useState<{
    next: string | null;
    prev: string | null;
  }>({
    next: null,
    prev: null,
  });

  useEffect(() => {
    if (contractAddress) {
      fetchNfts(contractAddress);
    }
  }, [contractAddress]);

  async function fetchNfts(address: string) {
    try {
      const response = await axios.get<{
        assets: Nft[];
        next: string;
        previous: string;
      }>(
        `https://api.opensea.io/api/v1/assets?asset_contract_address=${address}`
      );
      setNfts(response.data.assets);
      setCursor({
        next: response.data.next,
        prev: response.data.previous,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchNftsWithCursor(address: string, cursor: string) {
    try {
      const response = await axios.get<{
        assets: Nft[];
        next: string;
        previous: string;
      }>(
        `https://api.opensea.io/api/v1/assets?asset_contract_address=${address}&cursor=${cursor}`
      );
      setNfts(response.data.assets);
      setCursor({
        next: response.data.next,
        prev: response.data.previous,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCardClick(nft: Nft) {
    setSelectedNft(nft);

    try {
      const response = await axios.get<{
        owners: {
          owner: { user: { username: string | null } | null; address: string };
        }[];
      }>(
        `https://api.opensea.io/api/v1/asset/${nft.asset_contract.address}/${nft.token_id}/owners?limit=1&order_by=created_date&order_direction=desc`
      );
      const owner = response.data.owners[0].owner;
      setSelectedNft({
        ...nft,
        owner: owner.user?.username
          ? `${owner.user.username} (${owner.address})`
          : owner.address,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function handleModalClose() {
    setSelectedNft(null);
  }

  function handlePreviousPage() {
    if (contractAddress && cursor.prev) {
      // Disable action
      setCursor({
        next: null,
        prev: null,
      });
      fetchNftsWithCursor(contractAddress, cursor.prev);
    }
  }
  function handleNextPage() {
    if (contractAddress && cursor.next) {
      // Disable action
      setCursor({
        next: null,
        prev: null,
      });
      fetchNftsWithCursor(contractAddress, cursor.next);
    }
  }

  return (
    <div className="app">
      <h1>NFT Grid</h1>
      <input
        placeholder="Contract Address"
        value={contractAddress || ""}
        onChange={(e) => {
          e.preventDefault();

          setContractAddress(e.target.value);
        }}
        className="form-control form-control-lg"
      />

      <div className="nft-grid">
        {nfts.map((nft) => (
          <div key={nft.id} className="nft-grid-item">
            <NftCard nft={nft} onClick={handleCardClick} />
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-end ml-auto mt-4">
        <button
          className="btn btn-outline-secondary"
          disabled={!cursor.prev}
          onClick={handlePreviousPage}
        >
          Previous
        </button>
        <button
          className="btn btn-primary ml-2"
          disabled={!cursor.next}
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
      <NftModal nft={selectedNft} onHide={handleModalClose} />
    </div>
  );
};

export default App;
