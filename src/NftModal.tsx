import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Nft } from "./NftCard";

interface Props {
  nft: Nft | null;
  onHide: () => void;
}

const NftModal: React.FC<Props> = ({ nft, onHide }) => {
  return (
    <Modal show={!!nft} onHide={onHide}>
      {nft ? (
        <>
          <Modal.Header closeButton>
            <Modal.Title>
              {nft.name}
              <span className="modal-card-id">#{nft.token_id}</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={nft.image_url} alt={nft.name} style={{ width: "100%" }} />
            <p className="modal-nft-desc">{nft.description}</p>
            <p>By: {nft.creator.user.username}</p>
            <p>Owner: {nft.owner}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
            <Button
              variant="primary"
              href={nft.permalink}
              target="_blank"
              rel="noreferrer"
            >
              Purchase
            </Button>
          </Modal.Footer>{" "}
        </>
      ) : (
        <></>
      )}
    </Modal>
  );
};

export default NftModal;
