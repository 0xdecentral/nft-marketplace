import Image from "next/image";
import Anchor from "@ui/anchor";
import { useUser } from "src/contexts/UserContext";

const UserDropdown = () => {
    const { disconnect } = useUser();

    return (
        <div className="icon-box">
            <Anchor path="/author">
                <Image
                    src="/images/icons/boy-avater.png"
                    alt="Images"
                    layout="fixed"
                    width={38}
                    height={38}
                />
            </Anchor>
            <div className="rn-dropdown">
                <div className="rn-inner-top">
                    <h4 className="title">
                        <Anchor path="/product">Christopher William</Anchor>
                    </h4>
                </div>
                <div className="rn-product-inner">
                    <ul className="product-list">
                        <li className="single-product-list">
                            <div className="thumbnail">
                                <Image
                                    src="https://assets-cdn.trustwallet.com/blockchains/ethereum/info/logo.png"
                                    alt="Nft Product Images"
                                    layout="fixed"
                                    width={50}
                                    height={50}
                                />
                            </div>
                            <div className="content">
                                <h6 className="title">Balance</h6>
                                <span className="price">25 ETH</span>
                            </div>
                            <div className="button" />
                        </li>
                    </ul>
                </div>
                <ul className="list-inner">
                    <li>
                        <Anchor path="/author">My Profile</Anchor>
                    </li>
                    <li>
                        <Anchor path="/edit-profile">Edit Profile</Anchor>
                    </li>
                    <li>
                        <button type="button" onClick={disconnect}>
                            Sign Out
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserDropdown;
