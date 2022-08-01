import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import ExploreProductArea from "@containers/explore-product/layout-01";

// Demo data
import productData from "../data/products.json";
import { useEffect } from "react";
import { getNfts } from "src/services/firestore";
import { useState } from "react";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Home02 = () => {
    const [productData, setProductData] = useState([]);

    useEffect(() => {
        getNfts().then((res) => {
            const productData = res.map((nft) => nft.data());

            setProductData(productData);
        });
    }, []);
    return (
        <Wrapper>
            <SEO pageTitle="Explore Filter" />
            <Header />
            <main id="main-content">
                <ExploreProductArea
                    data={{
                        section_title: {
                            title: "Explore Product",
                        },
                        products: productData,
                    }}
                />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Home02;
