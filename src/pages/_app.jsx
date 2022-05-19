import { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import sal from "sal.js";
import { ThemeProvider } from "next-themes";
import "../assets/css/bootstrap.min.css";
import "../assets/css/feather.css";
import "../assets/scss/style.scss";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "src/contexts/UserContext";
import { EthereumProvider } from "src/contexts/EthereumContext";
import { SSRProvider } from "react-bootstrap";

const MyApp = ({ Component, pageProps }) => {
    const router = useRouter();
    useEffect(() => {
        sal({ threshold: 0.1, once: true });
    }, [router.asPath]);

    useEffect(() => {
        sal();
    }, []);
    useEffect(() => {
        document.body.className = `${pageProps.className}`;
    });

    const getLibrary = (provider) => {
        const library = new Web3Provider(provider, "any");
        library.pollingInterval = 12000;
        return library;
    };

    return (
        <SSRProvider>
            <ThemeProvider defaultTheme="dark">
                <Web3ReactProvider getLibrary={getLibrary}>
                    <UserProvider>
                        <EthereumProvider>
                            <Component {...pageProps} />
                        </EthereumProvider>
                    </UserProvider>
                </Web3ReactProvider>
            </ThemeProvider>
        </SSRProvider>
    );
};

MyApp.propTypes = {
    Component: PropTypes.elementType,
    pageProps: PropTypes.shape({
        className: PropTypes.string,
    }),
};

export default MyApp;
