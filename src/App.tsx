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

  useEffect(() => {
    if (contractAddress) {
      fetchNfts(contractAddress);
    }
  }, [contractAddress]);

  async function fetchNfts(address: string) {
    try {
      const response = await axios.get<{ assets: Nft[] }>(
        `https://api.opensea.io/api/v1/assets?asset_contract_address=${address}&limit=200`
      );
      setNfts(response.data.assets);
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
      <NftModal nft={selectedNft} onHide={handleModalClose} />
    </div>
  );
};

export default App;
