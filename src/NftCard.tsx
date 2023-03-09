import React from "react";

export interface Nft {
  id: number;
  token_id: string;
  name: string;
  image_url: string;
  image_preview_url: string;
  image_thumbnail_url: string;
  image_original_url: string;
  description: string;
  external_link: string;
  owner: string;
  asset_contract: AssetContract;
  permalink: string;
  creator: Creator;
}

export interface Creator {
  user: {
    username: string;
  };
}

export interface AssetContract {
  address: string;
}

interface Props {
  nft: Nft;
  onClick: (nft: Nft) => void;
}

const NftCard: React.FC<Props> = ({ nft, onClick }) => {
  return (
    <div className="card" onClick={() => onClick(nft)}>
      <img src={nft.image_thumbnail_url} alt={nft.name} />
      <div className="card-body">
        <div className="card-name">{nft.name}</div>
        <span className="card-id">#{nft.token_id}</span>
      </div>
    </div>
  );
};

export default NftCard;
