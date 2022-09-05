import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import AuthorIntroArea from "@containers/author-intro";
import AuthorProfileArea from "@containers/author-profile";

// Demo data
import productData from "../../data/products.json";
import { useEffect, useState } from "react";
import { getUser } from "src/services/firestore";
import { useUser } from "src/contexts/UserContext";

const Author = ({ user }) => {
    return (
        <Wrapper>
            <SEO pageTitle="Author" />
            <Header />
            <main id="main-content">
                <AuthorIntroArea data={user} />
                <AuthorProfileArea data={{ products: productData, user: user.address }} />
            </main>
            <Footer />
        </Wrapper>
    );
};



export async function getServerSideProps(ctx) {
    const userId = ctx.params.id;
    let user = null;

    if (userId.startsWith("0x")) {
        user = await getUser(userId);

        if (user) user = { ...user, created: null };
        else user = { address: userId };
    }

    return {
        props: {
            className: "template-color-1",
            user: user,
        }, // will be passed to the page component as props
    };
}

export default Author;
