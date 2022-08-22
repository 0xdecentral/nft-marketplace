import PropTypes from "prop-types";
import clsx from "clsx";
import Sticky from "@ui/sticky";
import Button from "@ui/button";
import GalleryTab from "@components/product-details/gallery-tab";
import ProductTitle from "@components/product-details/title";
import ProductCategory from "@components/product-details/category";
import ProductCollection from "@components/product-details/collection";
import BidTab from "@components/product-details/bid-tab";
import PlaceBet from "@components/product-details/place-bet";
import { ImageType } from "@utils/types";
import { useEffect, useMemo, useState } from "react";
import PlaceBidModal from "@components/modals/placebid-modal";
import { useUser } from "src/contexts/UserContext";
import { formatDateString, isAddressSame } from "@utils/formatter";
import ListModal from "@components/modals/list-modal";
import { getOrder } from "src/services/firestore";
import { getStartingPrice } from "@utils/orders";
import { formatAddress, getESLink } from "@utils/address";
import CountdownTimer from "@ui/countdown/layout-01";
import { isTimeAvailable } from "@utils/utils";
import AcceptBidModal from "@components/modals/acceptbid-modal";

// Demo Image

const ProductDetailsArea = ({ space, className, product }) => {
    const { account } = useUser();

    const [showBidModal, setShowBidModal] = useState(0);
    const [showListModal, setShowListModal] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);

    const [info, setInfo] = useState({});
    const [finalizedAuctionLabel, setFinalizedAuctionLabel] = useState();

    const isOwner = isAddressSame(product.owner, account);
    const listing = product.listing;

    const isListed = listing?.status === "fixed";
    const isAuctionStarted = listing?.status === "auction";

    const isListedOrAuctionStarted = isListed || isAuctionStarted;
    const isValidTime = isTimeAvailable(listing?.endTime);

    const isValidListedOrAuctionStarted =
        (isListed || isAuctionStarted) && isValidTime;

    useEffect(() => {
        if (!product) return;
        getOrder(`${product.address}-${product.tokenId}`).then((res) => {
            if (!res) return;

            const orders = res.orders;
            const lastOrder = orders[orders.length - 1];

            const auctionFinalized = !isTimeAvailable(listing?.endTime);

            if (auctionFinalized) {
                const finalizedAuctionLabel = "";
                const subOrders = lastOrder.subOrders;

                if (isOwner) finalizedAuctionLabel = "Get your fund";
                else if (
                    isAddressSame(
                        account,
                        subOrders[subOrders.length - 1].account
                    )
                )
                    finalizedAuctionLabel = "Get your NFT";

                setFinalizedAuctionLabel(finalizedAuctionLabel);
            }

            setInfo({
                startingPrice: getStartingPrice(res.orders),
                lastOrder,
                orderInfo: res,
            });
        });
    }, [product, account]);

    return (
        <>
            <div
                className={clsx(
                    "product-details-area",
                    space === 1 && "rn-section-gapTop",
                    className
                )}
            >
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-7 col-md-12 col-sm-12">
                            <Sticky>
                                <GalleryTab image={product.image} />
                            </Sticky>
                        </div>
                        <div className="col-lg-5 col-md-12 col-sm-12 mt_md--50 mt_sm--60">
                            <div className="rn-pd-content-area">
                                <ProductTitle
                                    title={product.title}
                                    likeCount={product.likeCount}
                                />
                                <span className="bid">
                                    Current Price:
                                    <span className="price">
                                        {info.startingPrice}
                                        {` `}Weth
                                    </span>
                                </span>
                                {/* <h6 className="title-name">
                                    Contract Address:
                                    <span className="mx-2">
                                        {product.address}
                                    </span>
                                </h6> */}
                                <h6 className="title-name">
                                    Owner:
                                    <a
                                        href={`${getESLink(product.owner)}`}
                                        target="_blank"
                                        className="mx-2"
                                    >
                                        {formatAddress(product.owner)}
                                    </a>
                                </h6>

                                {isValidListedOrAuctionStarted && (
                                    <div>
                                        <h6>
                                            Sale ends{" "}
                                            {formatDateString(
                                                info?.lastOrder?.endTime
                                            )}
                                        </h6>
                                    </div>
                                )}

                                <div className="mb-3">
                                    {listing?.endTime &&
                                    listing?.status &&
                                    isTimeAvailable(listing?.endTime) ? (
                                        <CountdownTimer
                                            date={listing?.endTime * 1000}
                                            isLeft={true}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                {/* <div className="catagory-collection">
                                    <ProductCategory
                                    owner={
                                        product.owner
                                            ? product.owner
                                            : product.creator
                                    }
                                />
                                    <ProductCollection
                                    collection={product.collection}
                                />
                                </div> */}
                                {isOwner && !isListedOrAuctionStarted && (
                                    <Button
                                        color="primary-alta"
                                        onClick={() => setShowListModal(true)}
                                    >
                                        List NFT
                                    </Button>
                                )}

                                {finalizedAuctionLabel && (
                                    <Button
                                        color="primary-alta"
                                        onClick={() => setShowAcceptModal(true)}
                                    >
                                        {finalizedAuctionLabel}
                                    </Button>
                                )}

                                {!isOwner && account && isValidTime && (
                                    <>
                                        {isListed ? (
                                            <div className="d-md-flex">
                                                <Button
                                                    color="primary-alta"
                                                    className="mr--20"
                                                    onClick={() =>
                                                        setShowBidModal(1)
                                                    }
                                                >
                                                    Buy
                                                </Button>
                                                <Button
                                                    color="primary-alta"
                                                    onClick={() =>
                                                        setShowBidModal(2)
                                                    }
                                                >
                                                    Offer
                                                </Button>
                                            </div>
                                        ) : isAuctionStarted ? (
                                            <Button
                                                color="primary-alta"
                                                onClick={() =>
                                                    setShowBidModal(3)
                                                }
                                            >
                                                Bid
                                            </Button>
                                        ) : null}
                                    </>
                                )}

                                <div className="rn-bid-details">
                                    <BidTab
                                        orderInfo={info?.orderInfo}
                                        owner={
                                            product.owner
                                                ? product.owner
                                                : product.creator
                                        }
                                        properties={product?.properties}
                                        tags={product?.tags}
                                        history={product?.history}
                                    />
                                    {/* <PlaceBet
                                    highest_bid={product?.highest_bid}
                                    auction_date={product?.auction_date}
                                /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PlaceBidModal
                status={showBidModal}
                handleClose={() => setShowBidModal(0)}
                nftAddress={product.address}
                tokenId={product.tokenId}
                tokenBalance={product.amount}
                initialPrice={
                    showBidModal === 1 ? product.listing.currentPrice : 0
                }
            />

            <ListModal
                show={showListModal}
                handleClose={() => setShowListModal(false)}
                nftAddress={product.address}
                tokenId={product.tokenId}
                tokenBalance={product.amount}
            />

            <AcceptBidModal
                open={showAcceptModal}
                handleClose={() => setShowAcceptModal(false)}
                nftAddress={product.address}
                tokenId={product.tokenId}
                info={info}
                finalizedAuctionLabel={finalizedAuctionLabel}
            />
        </>
    );
};

// ProductDetailsArea.propTypes = {
//     space: PropTypes.oneOf([1, 2]),
//     className: PropTypes.string,
//     product: PropTypes.shape({
//         title: PropTypes.string.isRequired,
//         likeCount: PropTypes.number,
//         price: PropTypes.shape({
//             amount: PropTypes.number.isRequired,
//             currency: PropTypes.string.isRequired,
//         }).isRequired,
//         owner: PropTypes.shape({}),
//         collection: PropTypes.shape({}),
//         bids: PropTypes.arrayOf(PropTypes.shape({})),
//         properties: PropTypes.arrayOf(PropTypes.shape({})),
//         tags: PropTypes.arrayOf(PropTypes.shape({})),
//         history: PropTypes.arrayOf(PropTypes.shape({})),
//         highest_bid: PropTypes.shape({}),
//         auction_date: PropTypes.string,
//         images: PropTypes.arrayOf(ImageType),
//     }),
// };

// ProductDetailsArea.defaultProps = {
//     space: 1,
// };

export default ProductDetailsArea;
