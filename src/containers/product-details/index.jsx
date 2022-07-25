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
import { isAddressSame } from "@utils/formatter";
import ListModal from "@components/modals/list-modal";
import { getOrder } from "src/services/firestore";

// Demo Image

const ProductDetailsArea = ({ space, className, product }) => {
    const { account } = useUser();

    const [showBidModal, setShowBidModal] = useState(0);
    const [showListModal, setShowListModal] = useState(false);
    const [orderInfo, setOrderInfo] = useState();

    const isOwner = isAddressSame(product.owner, account);
    const isListed = product.status === "fixed";
    const isAuctionStarted = product.status === "auction";

    useEffect(() => {
        if (!product) return;
        getOrder(`${product.address}-${product.tokenId}`).then((res) =>
            setOrderInfo(res)
        );
    }, [product]);

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
                                    {/* Height bid{" "}
                                <span className="price">
                                    {product.price.amount}
                                    {product.price.currency}
                                </span> */}
                                </span>
                                <h6 className="title-name">
                                    {product.address}
                                </h6>
                                <div className="catagory-collection">
                                    {/* <ProductCategory
                                    owner={
                                        product.owner
                                            ? product.owner
                                            : product.creator
                                    }
                                /> */}
                                    {/* <ProductCollection
                                    collection={product.collection}
                                /> */}
                                </div>
                                {isOwner && (
                                    <Button
                                        color="primary-alta"
                                        onClick={() => setShowListModal(true)}
                                    >
                                        List NFT
                                    </Button>
                                )}
                                {!isOwner && (
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
                                        bids={product?.bids}
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
            />

            <ListModal
                show={showListModal}
                handleClose={() => setShowListModal(false)}
                nftAddress={product.address}
                tokenId={product.tokenId}
                tokenBalance={product.amount}
            />
        </>
    );
};

ProductDetailsArea.propTypes = {
    space: PropTypes.oneOf([1, 2]),
    className: PropTypes.string,
    product: PropTypes.shape({
        // title: PropTypes.string.isRequired,
        // likeCount: PropTypes.number,
        // price: PropTypes.shape({
        //     amount: PropTypes.number.isRequired,
        //     currency: PropTypes.string.isRequired,
        // }).isRequired,
        // owner: PropTypes.shape({}),
        // collection: PropTypes.shape({}),
        // bids: PropTypes.arrayOf(PropTypes.shape({})),
        // properties: PropTypes.arrayOf(PropTypes.shape({})),
        // tags: PropTypes.arrayOf(PropTypes.shape({})),
        // history: PropTypes.arrayOf(PropTypes.shape({})),
        // highest_bid: PropTypes.shape({}),
        // auction_date: PropTypes.string,
        // images: PropTypes.arrayOf(ImageType),
    }),
};

ProductDetailsArea.defaultProps = {
    space: 1,
};

export default ProductDetailsArea;
