import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import ProductDetailsArea from "@containers/product-details";
import ProductArea from "@containers/product/layout-03";
import { shuffleArray } from "@utils/methods";

// demo data
import productData from "../../data/products.json";
import { getNft } from "src/services/firestore";

const ProductDetails = ({ product, recentViewProducts, relatedProducts }) => (
    <Wrapper>
        <SEO pageTitle="Product Details" />
        <Header />
        <main id="main-content">
            <Breadcrumb
                pageTitle="Product Details"
                currentPage="Product Details"
            />
            {!product ? (
                <h4 className="text-center my-md-5">Not found</h4>
            ) : (
                <>
                    <ProductDetailsArea product={product} />
                    {/* <ProductArea
                        data={{
                            section_title: { title: "Recent View" },
                            products: recentViewProducts,
                        }}
                    />
                    <ProductArea
                        data={{
                            section_title: { title: "Related Item" },
                            products: relatedProducts,
                        }}
                    /> */}
                </>
            )}
        </main>
        <Footer />
    </Wrapper>
);

// export async function getStaticPaths() {
//     return {
//         paths: productData.map(({ slug }) => ({
//             params: {
//                 slug,
//             },
//         })),
//         fallback: false,
//     };
// }

export async function getServerSideProps(ctx) {
    const slug = ctx.params.slug;
    let product = null;
    let recentViewProducts = [];
    let relatedProducts = [];

    if (slug.startsWith("0x")) {
        product = await getNft(slug);

        if (product) product = { ...product, created: null };
        else product = null;
    }

    return {
        props: {
            className: "template-color-1",
            product,
            recentViewProducts,
            relatedProducts,
        }, // will be passed to the page component as props
    };
}

ProductDetails.propTypes = {
    product: PropTypes.shape({}),
    recentViewProducts: PropTypes.arrayOf(PropTypes.shape({})),
    relatedProducts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default ProductDetails;
