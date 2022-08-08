import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "@ui/button";
import { useEthereum } from "src/contexts/EthereumContext";
import { useState } from "react";
import TokenAmount from "src/lib/TokenAmount";
import { ContractAddress } from "@assets/constants/addresses";
import { createSubOrder } from "src/services/firestore";
import { useUser } from "src/contexts/UserContext";

const PlaceBidModal = ({
    status,
    nftAddress,
    tokenId,
    tokenBalance,
    handleClose,
}) => {
    const [price, setPrice] = useState(0);

    const { erc1155Contract, tokenContract, marketplaceContract } =
        useEthereum();
    const { account } = useUser();

    const handlePlaceBid = async () => {
        //todo
        const tokenAddress = ContractAddress.TOKEN;
        const decimals = 18;
        const amount = new TokenAmount(price, decimals, false)
            .toWei()
            .toString();

        let type = "";

        try {
            let tx;

            tx = await tokenContract.approve(
                ContractAddress.MARKETPLACE,
                amount
            );

            await tx.wait();

            if (status === 1) {
                tx = await marketplaceContract.buyNFT(
                    nftAddress,
                    tokenId,
                    tokenAddress,
                    amount
                );
                type = "accepted";
            } else if (status === 2) {
                tx = await marketplaceContract.offerNFT(
                    nftAddress,
                    tokenId,
                    tokenAddress,
                    amount
                );
                type = "offer";
            } else {
                tx = await marketplaceContract.bidPlace(
                    nftAddress,
                    tokenId,
                    amount
                );

                type = "bid";
            }

            const res = await tx.wait();

            await createSubOrder(`${nftAddress}-${tokenId}`, {
                price: amount,
                account,
                type: type,
            });

            handleClose();
        } catch (error) {
            console.log("error while listing nft", error);
            handleClose();
        }
    };

    const handleChange = (event) => {
        setPrice(event.target.value);
    };

    const headerLabel =
        status === 1
            ? "Buy NFT"
            : status === 2
            ? "Offer new price"
            : "Place a bid";

    return (
        <Modal
            className="rn-popup-modal placebid-modal-wrapper"
            show={status !== 0}
            onHide={handleClose}
            centered
        >
            {status ? (
                <>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={handleClose}
                    >
                        <i className="feather-x" />
                    </button>
                    <Modal.Header>
                        <h3 className="modal-title">{headerLabel}</h3>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="placebid-form-box">
                            <h6 className="title">Price</h6>
                            <div className="bid-content">
                                <div className="bid-content-top">
                                    <div className="bid-content-left">
                                        <input
                                            id="value"
                                            type="text"
                                            name="value"
                                            onChange={handleChange}
                                        />
                                        <span>wETH</span>
                                    </div>
                                </div>

                                {/* <div className="bid-content-mid">
                            <div className="bid-content-left">
                                <span>Your Balance</span>
                                <span>Service fee</span>
                                <span>Total bid amount</span>
                            </div>
                            <div className="bid-content-right">
                                <span>9578 wETH</span>
                                <span>10 wETH</span>
                                <span>9588 wETH</span>
                            </div>
                        </div> */}
                            </div>
                            <div className="bit-continue-button">
                                <Button
                                    size="medium"
                                    fullwidth
                                    className="mt-5"
                                    onClick={handlePlaceBid}
                                >
                                    Place a bid
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </>
            ) : (
                <></>
            )}
        </Modal>
    );
};

PlaceBidModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};
export default PlaceBidModal;
