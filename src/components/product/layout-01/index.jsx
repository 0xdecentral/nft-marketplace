import { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import clsx from "clsx";
import Anchor from "@ui/anchor";
import CountdownTimer from "@ui/countdown/layout-01";
import ClientAvatar from "@ui/client-avatar";
import ShareDropdown from "@components/share-dropdown";
import ProductBid from "@components/product-bid";
import Button from "@ui/button";
import { ImageType } from "@utils/types";
import PlaceBidModal from "@components/modals/placebid-modal";
import { ContractAddress } from "@assets/constants/addresses";
import ListModal from "@components/modals/list-modal";
import { isTimeAvailable } from "@utils/utils";

const Product = ({
    overlay,
    title,
    slug,
    latestBid,
    price,
    likeCount,
    auction_date,
    image,
    bitCount,
    authors,
    placeBid,
    disableShareDropdown,
    nftAddress,
    tokenId,
    tokenBalance,
}) => {
    const [showListModal, setShowListModal] = useState(false);

    const getImageSrc = (image) => {
        return image.src ? image.src : `https://ipfs.infura.io/ipfs/${image}`;
    };

    return (
        <>
            <div
                className={clsx(
                    "product-style-one",
                    !overlay && "no-overlay",
                    placeBid && "with-placeBid"
                )}
            >
                <div className="card-thumbnail">
                    {(image || image?.src) && (
                        <Anchor path={`/product/${slug}`}>
                            <Image
                                src={getImageSrc(image)}
                                alt={image?.alt || "NFT_portfolio"}
                                width={533}
                                height={533}
                            />
                        </Anchor>
                    )}
                    {auction_date && isTimeAvailable(auction_date) ? (
                        <CountdownTimer date={auction_date} />
                    ) : (
                        <></>
                    )}
                    {placeBid && (
                        <Button
                            onClick={() => setShowListModal(true)}
                            size="small"
                        >
                            List NFT
                        </Button>
                    )}
                </div>
                <Anchor path={`/product/${slug}`}>
                    <span className="product-name mt-5">{title}</span>
                </Anchor>
                {/* <span className="latest-bid">Latest bid: {latestBid}</span> */}
                {price && <ProductBid price={price} likeCount={likeCount} />}
            </div>

            <ListModal
                show={showListModal}
                handleClose={() => setShowListModal(false)}
                nftAddress={nftAddress}
                tokenId={tokenId}
                tokenBalance={tokenBalance}
            />
        </>
    );
};

// Product.propTypes = {
//     overlay: PropTypes.bool,
//     title: PropTypes.string.isRequired,
//     slug: PropTypes.string.isRequired,
//     latestBid: PropTypes.string.isRequired,
//     price: PropTypes.shape({
//         amount: PropTypes.number.isRequired,
//         currency: PropTypes.string.isRequired,
//     }).isRequired,
//     likeCount: PropTypes.number.isRequired,
//     auction_date: PropTypes.string,
//     image: PropTypes.any,
//     authors: PropTypes.arrayOf(
//         PropTypes.shape({
//             name: PropTypes.string.isRequired,
//             slug: PropTypes.string.isRequired,
//             image: ImageType.isRequired,
//         })
//     ),
//     bitCount: PropTypes.number,
//     placeBid: PropTypes.bool,
//     disableShareDropdown: PropTypes.bool,
// };

// Product.defaultProps = {
//     overlay: false,
// };

export default Product;
