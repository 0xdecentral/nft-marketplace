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

const AcceptBidModal = ({
    nftAddress,
    tokenId,
    handleClose,
    open,
    info,
    finalizedAuctionLabel,
}) => {
    const { erc1155Contract, tokenContract, marketplaceContract } =
        useEthereum();
    const { account } = useUser();

    const [auctionInfo, setAuctionInfo] = useState();

    useEffect(() => {
        if (!info?.lastOrder) return;

        const lastSubOrders = info.lastOrder.subOrders;
        const lastSubOrder = lastSubOrders[lastSubOrders.length - 1];

        setAuctionInfo({
            bidder: lastSubOrder.account,
            creator: info.lastOrder.creator,
            price: lastSubOrder.price,
        });
    }, [info?.lastOrder]);

    const handleAcceptOffer = async () => {
        try {
            // const tx = await marketplaceContract.resultAuction(
            //     nftAddress,
            //     tokenId
            // );

            // const res = await tx.wait();

            await createSubOrder(`${nftAddress}-${tokenId}`, {
                account: auctionInfo?.bidder,
                price: formatTokenAmount(currentPrice, false),
                type: "auctionEnd",
            });
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
                <h3 className="modal-title">{finalizedAuctionLabel}</h3>
            </Modal.Header>
            <Modal.Body>
                <div className="placebid-form-box">
                    <div className="d-flex justify-content-between">
                        <h6 className="title">NFT owner:</h6>
                        <p className="title">
                            {formatAddress(auctionInfo?.creator)}
                        </p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <h6 className="title">Bidder:</h6>
                        <p className="title">
                            {formatAddress(auctionInfo?.bidder)}
                        </p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <h6 className="title">Price</h6>
                        <p className="title">
                            {formatTokenAmount(auctionInfo?.price)}{" "}
                            <span>wETH</span>
                        </p>
                    </div>
                    <div className="bit-continue-button">
                        <Button
                            size="medium"
                            fullwidth
                            className="mt-5"
                            onClick={handleAcceptOffer}
                        >
                            Get
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

AcceptBidModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};
export default AcceptBidModal;
