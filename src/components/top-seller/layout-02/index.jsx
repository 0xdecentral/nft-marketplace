import Image from "next/image";
import PropTypes from "prop-types";
import clsx from "clsx";
import Anchor from "@ui/anchor";
import { formatTokenAmount } from "@utils/orders";
import { formatAddress } from "@utils/address";
import { formatTimeDifference, isAddressSame } from "@utils/formatter";
import Button from "@ui/button";
import AcceptOfferModal from "@components/modals/acceptoffer-modal";
import { useState } from "react";
import { useUser } from "src/contexts/UserContext";

const TopSeller = ({
    name,
    time,
    path,
    image,
    eth,
    isVarified,
    type,
    creator,
    nftAddress,
    tokenId,
    orderStatus,
}) => {
    const [openModal, setOpenModal] = useState(false);
    const { account } = useUser();

    return (
        <div className="top-seller-inner-one">
            <div className="top-seller-wrapper">
                {image?.src && (
                    <div
                        className={clsx("thumbnail", isVarified && "varified")}
                    >
                        <Anchor path={path}>
                            <Image
                                src={image.src}
                                alt={image?.alt || "Nft_Profile"}
                                width={image?.width || 50}
                                height={image?.height || 50}
                                layout="fixed"
                            />
                        </Anchor>
                    </div>
                )}
                <div className="top-seller-content">
                    <span>
                        {type === "fixed"
                            ? "Listed with "
                            : type === "auction"
                            ? "Auction started with "
                            : type === "offer"
                            ? "Offered with "
                            : type === "bid"
                            ? "Bid with "
                            : type === "buy"
                            ? "Bought with "
                            : type === "offerAccept"
                            ? "Accepted with "
                            : type === "auctionEnd"
                            ? "Acution ended with "
                            : ""}
                        {eth && <>{formatTokenAmount(eth)}wETH by</>}
                        <Anchor path={path}>{formatAddress(name)}</Anchor>
                    </span>
                    {time && (
                        <span className="count-number">
                            {formatTimeDifference(time)}
                        </span>
                    )}
                </div>

                {type === "offer" &&
                    isAddressSame(creator, account) &&
                    orderStatus !== null && (
                        <Button
                            color="primary-alta"
                            size="small"
                            className="ml--30"
                            onClick={() => setOpenModal(true)}
                        >
                            Accept
                        </Button>
                    )}
            </div>
            <AcceptOfferModal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                nftAddress={nftAddress}
                tokenId={tokenId}
                currentPrice={formatTokenAmount(eth)}
                offerer={name}
            />
        </div>
    );
};

TopSeller.propTypes = {
    name: PropTypes.string.isRequired,
    time: PropTypes.string,
    path: PropTypes.string.isRequired,
    eth: PropTypes.string,
    image: PropTypes.shape({
        src: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string])
            .isRequired,
        alt: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
    }).isRequired,
    isVarified: PropTypes.bool,
};

export default TopSeller;
