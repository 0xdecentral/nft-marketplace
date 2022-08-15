import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "@ui/button";
import { useEthereum } from "src/contexts/EthereumContext";
import { useState } from "react";
import TokenAmount from "src/lib/TokenAmount";
import { ContractAddress } from "@assets/constants/addresses";
import clsx from "clsx";
import { convertToUnixTimestamp, currentUnixTimestamp } from "@utils/formatter";
import { createOrUpdateOrder } from "src/services/firestore";
import { useUser } from "src/contexts/UserContext";

const ListModal = ({
    show,
    nftAddress,
    tokenId,
    tokenBalance,
    handleClose,
}) => {
    const [price, setPrice] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFixed, setIsFixed] = useState(true);
    const { account } = useUser();

    const { erc1155Contract, tokenContract, marketplaceContract } =
        useEthereum();

    const handleList = async () => {
        //todo
        const tokenAddress = ContractAddress.TOKEN;
        const decimals = 18;
        const amount = new TokenAmount(price, decimals, false)
            .toWei()
            .toString();

        try {
            let tx;

            tx = await erc1155Contract.setApprovalForAll(
                ContractAddress.MARKETPLACE,
                true
            );

            await tx.wait();

            if (isFixed) {
                tx = await marketplaceContract.listNFT(
                    nftAddress,
                    tokenId,
                    tokenAddress,
                    amount
                );
            } else {
                tx = await marketplaceContract.createAuction(
                    nftAddress,
                    tokenId,
                    tokenAddress,
                    amount,
                    amount,
                    currentUnixTimestamp(),
                    convertToUnixTimestamp(duration)
                );
            }

            const res = await tx.wait();

            createOrUpdateOrder(`${nftAddress}-${tokenId}`, {
                type: isFixed ? "fixed" : "auction",
                price: amount,
                address: nftAddress,
                tokenAddress,
                tokenId: tokenId,
                endTime: convertToUnixTimestamp(duration),
                creator: account,
            });

            handleClose();
        } catch (error) {
            console.log("error while listing nft", error);
            handleClose();
        }
    };

    const handleChangePrice = (event) => {
        setPrice(event.target.value);
    };

    const handleChangeDuration = (event) => {
        setDuration(event.target.value);
    };

    const priceLabel = isFixed ? "Price" : "Starting price";

    return (
        <Modal
            className="rn-popup-modal placebid-modal-wrapper"
            show={show}
            onHide={handleClose}
            centered
        >
            {show && (
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleClose}
                >
                    <i className="feather-x" />
                </button>
            )}
            <Modal.Header>
                <h3 className="modal-title">List your NFT</h3>
            </Modal.Header>
            <Modal.Body>
                <div className="placebid-form-box">
                    <div className="bid-content">
                        <div className="row mb--50 align-items-center">
                            <div
                                className={clsx(
                                    "col-lg-6 col-md-6 col-sm-6 col-12 bid-type",
                                    isFixed && "active"
                                )}
                                onClick={() => setIsFixed(true)}
                            >
                                Fixed Price
                            </div>
                            <div
                                className={clsx(
                                    "col-lg-6 col-md-6 col-sm-6 col-12 bid-type",
                                    !isFixed && "active"
                                )}
                                onClick={() => setIsFixed(false)}
                            >
                                Timed Auction
                            </div>
                        </div>
                        <div className="bid-content-top">
                            <h6 className="title">{priceLabel}</h6>
                            <div className="bid-content-left">
                                <input
                                    id="value"
                                    type="text"
                                    name="value"
                                    onChange={handleChangePrice}
                                />
                                <span>wETH</span>
                            </div>
                        </div>

                        <div className="bid-content-top mt-3">
                            <h6 className="title">Duration</h6>
                            <div className="bid-content-left">
                                <input
                                    id="value"
                                    type="date"
                                    name="value"
                                    onChange={handleChangeDuration}
                                />
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
                    <div className="bit-continue-button mt-5">
                        <Button size="medium" fullwidth onClick={handleList}>
                            List
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

ListModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};
export default ListModal;
