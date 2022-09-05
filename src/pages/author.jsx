import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import AuthorIntroArea from "@containers/author-intro";
import AuthorProfileArea from "@containers/author-profile";

// Demo data
import productData from "../data/products.json";
import { useEffect, useState } from "react";
import { getUser } from "src/services/firestore";
import { useUser } from "src/contexts/UserContext";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Author = () => {
    const { account } = useUser();
    const [authorInfo, setAuthorInfo] = useState();

    useEffect(() => {
        if (!account) return;

        getUser(account).then((res) => {
            setAuthorInfo(res);
        });
    }, [account]);

    return (
        <Wrapper>
            <SEO pageTitle="Author" />
            <Header />
            <main id="main-content">
                <AuthorIntroArea data={authorInfo} />
                <AuthorProfileArea data={{ products: productData, user: account }} />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Author;
