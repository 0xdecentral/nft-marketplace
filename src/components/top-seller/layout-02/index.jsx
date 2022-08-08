import Image from "next/image";
import PropTypes from "prop-types";
import clsx from "clsx";
import Anchor from "@ui/anchor";
import { formatTokenAmount } from "@utils/orders";
import { formatAddress } from "@utils/address";
import { formatTimeDifference } from "@utils/formatter";

const TopSeller = ({ name, time, path, image, eth, isVarified, type }) => {
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
                            ? "List with "
                            : type === "auction"
                            ? "Auction with "
                            : type === "offer"
                            ? "Offer with "
                            : type === "bid"
                            ? "Bid with "
                            : type === "accepted"
                            ? "Buy with "
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
            </div>
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
