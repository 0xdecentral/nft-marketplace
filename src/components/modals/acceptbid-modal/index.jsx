import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "@ui/button";
import { useEthereum } from "src/contexts/EthereumContext";
import { useEffect, useMemo, useState } from "react";
import TokenAmount from "src/lib/TokenAmount";
import { ContractAddress } from "@assets/constants/addresses";
import { createSubOrder } from "src/services/firestore";
import { useUser } from "src/contexts/UserContext";
import { formatTokenAmount } from "@utils/orders";
import { formatAddress } from "@utils/address";

const AccceptBidModal = ({
    nftAddress,
    tokenId,
    handleClose,
    currentPrice,
    open,
    offerer,
}) => {
    const { erc1155Contract, tokenContract, marketplaceContract } =
        useEthereum();
    const { account } = useUser();

    const handleAcceptBid = async () => {
        try {
            const tx = await marketplaceContract.acceptOfferNFT(
                nftAddress,
                tokenId,
                offerer
            );

            const res = await tx.wait();

            // await createSubOrder(`${nftAddress}-${tokenId}`, {
            //     price: amount,
            //     account,
            //     type: type,
            // });
        } catch (err) {
            console.log("error:", err);
        }

        handleClose();
    };

    return (
        <Modal
            className="rn-popup-modal placebid-modal-wrapper"
            show={open}
            onHide={handleClose}
            centered
        >
            <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
            >
                <i className="feather-x" />
            </button>
            <Modal.Header>
                <h3 className="modal-title">Accept Bid</h3>
            </Modal.Header>
            <Modal.Body>
                <div className="placebid-form-box">
                    <div className="d-flex justify-content-between">
                        <h6 className="title">Offerer</h6>
                        <p className="title">{formatAddress(offerer)}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <h6 className="title">Price</h6>
                        <p className="title">
                            {currentPrice} <span>wETH</span>
                        </p>
                    </div>
                    {/* <h6 className="title">Price</h6>
                    <div className="bid-content">
                        <div className="bid-content-top">
                            <div className="bid-content-left">
                                <input
                                    disabled={true}
                                    id="value"
                                    type="text"
                                    name="value"
                                    value={currentPrice}
                                />
                                <span>wETH</span>
                            </div>
                        </div>
                    </div> */}
                    <div className="bit-continue-button">
                        <Button
                            size="medium"
                            fullwidth
                            className="mt-5"
                            onClick={handleAcceptBid}
                        >
                            Accept bid
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

AccceptBidModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};
export default AccceptBidModal;
