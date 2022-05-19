import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceABI from "@assets/constants/abis/Marketplace.json";
import TokenABI from "@assets/constants/abis/Token.json";
import { ContractAddress } from "@assets/constants/addresses";
import { useUser } from "./UserContext";

const Context = React.createContext({});

const Provider = ({ children }) => {
    const { library, account } = useUser();
    const [marketplaceContract, setMarketplaceContract] = useState();
    const [tokenContract, setTokenContract] = useState();

    useEffect(() => {
        loadContracts();
    }, [account, library]);

    const loadContracts = async () => {
        if (!library || !account) {
            setMarketplaceContract(null);
            setTokenContract(null);
            return;
        }

        const signer = await library.getSigner(account);
        const marketplaceContract = new ethers.Contract(
            ContractAddress.MARKETPLACE,
            MarketplaceABI,
            signer
        );

        setMarketplaceContract(marketplaceContract);

        const tokenContract = new ethers.Contract(
            ContractAddress.TOKEN,
            TokenABI,
            signer
        );

        setTokenContract(tokenContract);
    };

    return (
        <Context.Provider
            value={{
                marketplaceContract,
                tokenContract,
            }}
        >
            {children}
        </Context.Provider>
    );
};
export default Context;

export const EthereumProvider = Provider;

export const useEthereum = () => {
    return useContext(Context);
};
