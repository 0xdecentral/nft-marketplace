/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import Button from "@ui/button";
import ProductModal from "@components/modals/product-modal";
import ErrorText from "@ui/error-text";
import { toast } from "react-toastify";
import { create } from "ipfs-http-client";
import { useEthereum } from "src/contexts/EthereumContext";
import { createNFT, createUser, updateNFT } from "src/services/firestore";
import { useUser } from "src/contexts/UserContext";

const projectId = "2AV5zpklOWMZTeOM655tlEONPnj";
const projectSecret = "373ca3c12a0fb3555dc913e7ff2ee356";
const authorization =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = create({
    url: "https://ipfs.infura.io:5001",
    headers: {
        authorization,
    },
});

const CreateNewArea = ({ className, space }) => {
    const [showProductModal, setShowProductModal] = useState(false);
    const [imageCID, setImageCID] = useState();
    const [hasImageError, setHasImageError] = useState(false);
    const [previewData, setPreviewData] = useState({});
    const { erc1155Contract } = useEthereum();
    const { account } = useUser();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        mode: "onChange",
    });

    const notify = () => toast("Your product has submitted");
    const handleProductModal = () => {
        setShowProductModal(false);
    };

    // This function will be triggered when the file field change
    // const imageChange = (e) => {
    //     if (e.target.files && e.target.files.length > 0) {
    //         setSelectedImage(e.target.files[0]);
    //     }
    // };

    async function imageChange(e) {
        const file = e.target.files[0];
        try {
            const added = await client.add(file, {
                progress: (prog) => console.log(`received: ${prog}`),
            });
            setImageCID(added.path);
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    }

    const onSubmit = async (data, e) => {
        // // make temp nft
        // const nftAddress = "0xdef0b12f772bad3402d2ac764488b88e16f67856";
        // const tokenId = "8";
        // const image =
        //     "https://ipfs.io/ipfs/QmUKPyGpsYuxEuX6VmPpC8uaTUL7KLJWTEucZMjNbqxsNW";
        // const metadataCID = "QmRM8WZkQz5BTK1m7UbxL6TJWotSjm4sCK2UJG33ozPncA";
        // createNFT(`${nftAddress}-${tokenId}`, {
        //     amount: 3,
        //     description: "BGGH",
        //     title: "BGF",
        //     metadataCID,
        //     creator: "0x8ebf16e9653EA8EF042eEc160970CC27226526b4",
        //     owner: "0x8ebf16e9653EA8EF042eEc160970CC27226526b4",
        //     image: image,
        //     address: nftAddress,
        //     tokenId: tokenId,
        //     status: null,
        // });
        setHasImageError(!imageCID);
        try {
            let metadataCID;
            try {
                const metadata = { ...data };
                metadata["image"] = imageCID;
                delete metadata.amount;
                const file = JSON.stringify(metadata);
                const added = await client.add(file, {
                    progress: (prog) => console.log(`received: ${prog}`),
                });
                metadataCID = added.path;
            } catch (error) {
                console.log("Error uploading file: ", error);
            }
            if (metadataCID) {
                const tx = await erc1155Contract.mint(
                    metadataCID,
                    data.amount,
                    "0x"
                );
                const res = await tx.wait();
                const event = res.events.find(
                    (e) => e.event === "TokenERC1155Mint"
                );
                const nftAddress = res.to.toLowerCase();
                const tokenId = event.args.tokenId.toString();

                createNFT(`${nftAddress}-${tokenId}`, {
                    amount: data.amount,
                    description: data.description,
                    title: data.name,
                    metadataCID,
                    creator: account,
                    owner: account,
                    image: `https://ipfs.io/ipfs/${imageCID}`,
                    address: nftAddress,
                    tokenId,
                    status: null,
                });
            }
        } catch (error) {
            console.log("Erorr minting NFT", error);
        }
    };

    // create temp user
    // useEffect(() => {
    //     if (account) {
    //         createUser(account);
    //     }
    // }, [account]);

    return (
        <>
            <div
                className={clsx(
                    "create-area",
                    space === 1 && "rn-section-gapTop",
                    className
                )}
            >
                <form action="#" onSubmit={handleSubmit(onSubmit)}>
                    <div className="container">
                        <div className="row g-5">
                            <div className="col-lg-3 offset-1 ml_md--0 ml_sm--0">
                                <div className="upload-area mb--200">
                                    <div className="upload-formate mb--30">
                                        <h6 className="title">Upload file</h6>
                                        <p className="formate">
                                            Drag or choose your file to upload
                                        </p>
                                    </div>

                                    <div className="brows-file-wrapper">
                                        <input
                                            name="file"
                                            id="file"
                                            type="file"
                                            className="inputfile"
                                            data-multiple-caption="{count} files selected"
                                            multiple
                                            onChange={imageChange}
                                        />
                                        {imageCID && (
                                            <img
                                                id="createfileImage"
                                                src={`https://ipfs.infura.io/ipfs/${imageCID}`}
                                                alt=""
                                                data-black-overlay="6"
                                            />
                                        )}

                                        <label
                                            htmlFor="file"
                                            title="No File Choosen"
                                        >
                                            <i className="feather-upload" />
                                            <span className="text-center">
                                                Choose a File
                                            </span>
                                            <p className="text-center mt--10">
                                                PNG, GIF, WEBP, MP4 or MP3.{" "}
                                                <br /> Max 1Gb.
                                            </p>
                                        </label>
                                    </div>
                                    {hasImageError && !imageCID && (
                                        <ErrorText>Image is required</ErrorText>
                                    )}
                                </div>

                                {/* <div className="mt--100 mt_sm--30 mt_md--30 d-none d-lg-block">
                                    <h5> Note: </h5>
                                    <span>
                                        {" "}
                                        Service fee : <strong>2.5%</strong>{" "}
                                    </span>{" "}
                                    <br />
                                    <span>
                                        {" "}
                                        You will receive :{" "}
                                        <strong>25.00 ETH $50,000</strong>
                                    </span>
                                </div> */}
                            </div>
                            <div className="col-lg-7">
                                <div className="form-wrapper-one">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="name"
                                                    className="form-label"
                                                >
                                                    Product Name
                                                </label>
                                                <input
                                                    id="name"
                                                    placeholder="e. g. `Digital Awesome Game`"
                                                    {...register("name", {
                                                        required:
                                                            "Name is required",
                                                    })}
                                                />
                                                {errors.name && (
                                                    <ErrorText>
                                                        {errors.name?.message}
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="Description"
                                                    className="form-label"
                                                >
                                                    Description
                                                </label>
                                                <textarea
                                                    id="description"
                                                    rows="3"
                                                    placeholder="e. g. “After purchasing the product you can get item...”"
                                                    {...register(
                                                        "description",
                                                        {
                                                            required:
                                                                "Description is required",
                                                        }
                                                    )}
                                                />
                                                {errors.description && (
                                                    <ErrorText>
                                                        {
                                                            errors.description
                                                                ?.message
                                                        }
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>

                                        {
                                            /* <div className="col-md-4">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="price"
                                                    className="form-label"
                                                >
                                                    Item Price in $
                                                </label>
                                                <input
                                                    id="price"
                                                    placeholder="e. g. `20$`"
                                                    {...register("price", {
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message:
                                                                "Please enter a number",
                                                        },
                                                        required:
                                                            "Price is required",
                                                    })}
                                                />
                                                {errors.price && (
                                                    <ErrorText>
                                                        {errors.price?.message}
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="Size"
                                                    className="form-label"
                                                >
                                                    Size
                                                </label>
                                                <input
                                                    id="size"
                                                    placeholder="e. g. `Size`"
                                                    {...register("size", {
                                                        required:
                                                            "Size is required",
                                                    })}
                                                />
                                                {errors.size && (
                                                    <ErrorText>
                                                        {errors.size?.message}
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="Propertie"
                                                    className="form-label"
                                                >
                                                    Properties
                                                </label>
                                                <input
                                                    id="propertiy"
                                                    placeholder="e. g. `Propertie`"
                                                    {...register("propertiy", {
                                                        required:
                                                            "Propertiy is required",
                                                    })}
                                                />
                                                {errors.propertiy && (
                                                    <ErrorText>
                                                        {
                                                            errors.propertiy
                                                                ?.message
                                                        }
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div> */

                                            <div className="col-md-12">
                                                <div className="input-box pb--20">
                                                    <label
                                                        htmlFor="1155"
                                                        className="form-label"
                                                    >
                                                        Amount
                                                    </label>
                                                    <input
                                                        id="amount"
                                                        placeholder="Default: 1"
                                                        defaultValue={1}
                                                        {...register("amount", {
                                                            required:
                                                                "Amount is required",
                                                        })}
                                                    />
                                                    {errors.amount && (
                                                        <ErrorText>
                                                            {
                                                                errors.amount
                                                                    ?.message
                                                            }
                                                        </ErrorText>
                                                    )}
                                                </div>
                                            </div>

                                            /*                                        <div className="col-md-4 col-sm-4">
                                            <div className="input-box pb--20 rn-check-box">
                                                <input
                                                    className="rn-check-box-input"
                                                    type="checkbox"
                                                    id="putonsale"
                                                />
                                                <label
                                                    className="rn-check-box-label"
                                                    htmlFor="putonsale"
                                                >
                                                    Put on Sale
                                                </label>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-sm-4">
                                            <div className="input-box pb--20 rn-check-box">
                                                <input
                                                    className="rn-check-box-input"
                                                    type="checkbox"
                                                    id="instantsaleprice"
                                                />
                                                <label
                                                    className="rn-check-box-label"
                                                    htmlFor="instantsaleprice"
                                                >
                                                    Instant Sale Price
                                                </label>
                                            </div>
                                        </div>

                                        <div className="col-md-4 col-sm-4">
                                            <div className="input-box pb--20 rn-check-box">
                                                <input
                                                    className="rn-check-box-input"
                                                    type="checkbox"
                                                    id="unlockpurchased"
                                                />
                                                <label
                                                    className="rn-check-box-label"
                                                    htmlFor="unlockpurchased"
                                                >
                                                    Unlock Purchased
                                                </label>
                                            </div>
                                        </div> */
                                        }

                                        {/* <div className="col-md-12 col-xl-4">
                                            <div className="input-box">
                                                <Button
                                                    color="primary-alta"
                                                    fullwidth
                                                    type="submit"
                                                    data-btn="preview"
                                                    onClick={handleSubmit(
                                                        onSubmit
                                                    )}
                                                >
                                                    Preview
                                                </Button>
                                            </div>
                                        </div> */}

                                        <div className="col-md-12 col-xl-12 mt_lg--15 mt_md--15 mt_sm--15">
                                            <div className="input-box">
                                                <Button type="submit" fullwidth>
                                                    Mint NFT
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="mt--100 mt_sm--30 mt_md--30 d-block d-lg-none">
                                <h5> Note: </h5>
                                <span>
                                    {" "}
                                    Service fee : <strong>2.5%</strong>{" "}
                                </span>{" "}
                                <br />
                                <span>
                                    {" "}
                                    You will receive :{" "}
                                    <strong>25.00 ETH $50,000</strong>
                                </span>
                            </div> */}
                        </div>
                    </div>
                </form>
            </div>
            {showProductModal && (
                <ProductModal
                    show={showProductModal}
                    handleModal={handleProductModal}
                    data={previewData}
                />
            )}
        </>
    );
};

CreateNewArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1]),
};

CreateNewArea.defaultProps = {
    space: 1,
};

export default CreateNewArea;
