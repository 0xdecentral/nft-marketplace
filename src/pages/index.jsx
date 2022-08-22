import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import HeroArea from "@containers/hero/layout-01";
import LiveExploreArea from "@containers/live-explore/layout-01";
import ServiceArea from "@containers/services/layout-01";
import NewestItmesArea from "@containers/product/layout-04";
import TopSellerArea from "@containers/top-seller/layout-01";
import ExploreProductArea from "@containers/explore-product/layout-01";
import CollectionArea from "@containers/collection/layout-01";
import { normalizedData } from "@utils/methods";

// Demo Data
import homepageData from "../data/homepages/home-01.json";
import sellerData from "../data/sellers.json";
import collectionsData from "../data/collections.json";
import { useEffect, useMemo, useState } from "react";
import { getNfts } from "src/services/firestore";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Home = () => {
    const [productData, setProductData] = useState([]);

    useEffect(() => {
        getNfts().then((res) => {
            const productData = res.map((nft) => nft.data());

            setProductData(productData);
        });
    }, []);

    const content = normalizedData(homepageData?.content || []);

    const liveAuctionData = useMemo(
        () =>
            productData.filter(
                (prod) =>
                    prod?.listing?.status &&
                    new Date() <= new Date(prod?.listing?.endTime * 10000)
            ),
        [productData]
    );

    const newestData = useMemo(
        () =>
            productData
                .sort(
                    (a, b) =>
                        Number(new Date(a.created)) -
                        Number(new Date(b.created))
                )
                .slice(0, 5),
        [productData]
    );

    return (
        <Wrapper>
            <SEO pageTitle="Home Default" />
            <Header />
            <main id="main-content">
                <HeroArea data={content["hero-section"]} />
                <LiveExploreArea
                    data={{
                        ...content["live-explore-section"],
                        products: liveAuctionData,
                    }}
                />
                <ServiceArea data={content["service-section"]} />
                {/* <ExploreProductArea
                    data={{
                        section_title: {
                            title: "Explore Product",
                        },
                        products: productData,
                    }}
                /> */}
                <NewestItmesArea
                    data={{
                        ...content["newest-section"],
                        products: newestData,
                    }}
                />
                {/* <TopSellerArea
                    data={{
                        ...content["top-sller-section"],
                        sellers: sellerData,
                    }}
                /> */}

                {/* <CollectionArea
                    data={{
                        ...content["collection-section"],
                        collections: collectionsData.slice(0, 4),
                    }}
                /> */}
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Home;
