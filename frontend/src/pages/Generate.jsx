/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from "react";
import { styled } from "styled-components";
import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider, ethers } from "ethers";
import { useAuth } from "../context/AuthContext";
import { useCoupon } from "../context/CouponContext";
import HomeIcon from "@mui/icons-material/Home";
import {
    Add,
    AddCircle,
    Chat,
    Close,
    ErrorOutlineOutlined,
    Favorite,
    HeatPumpRounded,
    Person,
    UploadFileOutlined,
} from "@mui/icons-material";
import moment from "moment";
import { useDropzone } from "react-dropzone";
import { sha256 } from "ethers/lib/utils";

const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: "2px",
    borderRadius: "1rem",
    borderColor: "#E3E3E3",
    backgroundColor: "#a1a1a155",
    color: "#6e6e6e",
    outline: "none",
    transition: "border .24s ease-in-out",
    cursor: "pointer",
};

const focusedStyle = {
    borderColor: "#2196f3",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

const Generate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [brandName, setBrandName] = useState("");
    const [couponName, setCouponName] = useState("");
    const [couponQuantity, setCouponQuantity] = useState("");
    const [couponValue, setCouponValue] = useState("0");
    const [profileBio, setProfileBio] = useState("");
    const [nftPicFile, setNFTPicFile] = useState(null);
    const { currentAccount, checkIfWalletConnected } = useAuth();
    const {
        addBulkProducts,
        getCompanyByAddress,
        buyCoupon,
        fetchUsersList,
        fetchCompanyCoupons,
        users,
        setUsers,
    } = useCoupon();
    const [company, setCompany] = useState({});

    useEffect(() => {
        if (currentAccount === "") checkIfWalletConnected();
        else fetchCompany();
    }, [currentAccount]);

    const onDrop = useCallback(
        (acceptedFiles) => {
            const tempList = acceptedFiles;
            let profileContent;
            tempList.forEach((f, index) => {
                if (
                    f.path.includes(".png") ||
                    f.path.includes(".jpg") ||
                    f.path.includes(".jpeg")
                ) {
                    profileContent = f;
                    tempList.splice(index, 1);
                }
            });
            if (!profileContent) {
                alert("Atleast upload one image!");
                return;
            }
            setNFTPicFile([profileContent, ...tempList]);
        },
        [setNFTPicFile]
    );

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({ onDrop });

    const handleMint = async (couponQuantity, couponValue) => {
        try {
            let tokenURIs = [];
            let categories = [];
            let ratings = [];
            // console.log(`${sha256(moment().valueOf())}`.substring(2, 10));
            for (let i = 0; i < couponQuantity; i++) {
                tokenURIs.push(
                    JSON.stringify({
                        cid: "",
                        code: `${sha256(moment().valueOf() + Math.floor(Math.random() * 100))}`.substring(2, 10),
                        value: `${couponValue}`,
                    })
                );
                categories.push("asdf");
                ratings.push(parseInt(couponValue));
            }

            // await addBulkProducts(
            //     company.companyId,
            //     parseInt(couponQuantity),
            //     tokenURIs,
            //     categories,
            //     ratings
            // );

            const coupons = await fetchCompanyCoupons(
                parseInt(company.companyId.toString())
            );

            console.log(coupons);

            let j = 0;
            for (let i = 0; i < coupons.length; i++) {
                console.log("Hello")
                await buyCoupon(coupons[i].couponId, users[j++]);
                if (j === users.length) j = 0;
            }
            setUsers([]);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchCompany = useCallback(async () => {
        const data = await getCompanyByAddress(currentAccount);
        console.log(data);
        setCompany(data);
    }, []);

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );

    return (
        <ExtensionContainer>
            <ExtensionContentCard>
                <AppHeaderContainer>
                    <AppLogo>CouponStack</AppLogo>
                </AppHeaderContainer>
                <RegisterPageContainer>
                    <UserCountInfo>
                        {users.length} users are eligible for the coupons!
                    </UserCountInfo>
                    <TextInputGroup>
                        <span>Brand Name</span>
                        <CustomInput
                            type="text"
                            value={company?.name}
                            disabled={true}
                            placeholder="Enter your brand name"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Coupon Name</span>
                        <CustomInput
                            type="text"
                            value={couponName}
                            onChange={(e) => {
                                setCouponName(e.target.value);
                            }}
                            placeholder="Enter your coupon name"
                        />
                    </TextInputGroup>

                    <TextInputGroup>
                        <span>Coupon NFT Image</span>
                        <div {...getRootProps({ style })}>
                            <input {...getInputProps()} />
                            <UploadFileOutlined />
                            <p>
                                {nftPicFile != null
                                    ? `${nftPicFile.length} files added`
                                    : "Upload image"}
                            </p>
                        </div>
                    </TextInputGroup>

                    <TextInputGroup>
                        <span>Quantity</span>
                        <CustomInput
                            type="text"
                            value={couponQuantity}
                            onChange={(e) => {
                                setCouponQuantity(e.target.value);
                            }}
                            placeholder="Number of coupons to generate"
                        />
                    </TextInputGroup>

                    <TextInputGroup>
                        <span>Value</span>
                        <CustomInput
                            type="text"
                            value={couponValue}
                            onChange={(e) => {
                                setCouponValue(e.target.value);
                            }}
                            placeholder="Discount provided by the coupon"
                        />
                    </TextInputGroup>
                </RegisterPageContainer>
                <SubmitButton
                    onClick={(e) => handleMint(couponQuantity, couponValue)}
                >
                    {isLoading ? <BeatLoader color="#ffffff" /> : "Create"}
                </SubmitButton>
            </ExtensionContentCard>
        </ExtensionContainer>
    );
};

const ExtensionContainer = styled.div`
    background-color: black;
    height: 100vh;
    min-width: 300px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    padding: 1rem;
    color: white;
`;

const ExtensionContentCard = styled.div`
    width: max(30%, 400px);
    height: 90%;
    background-color: #1f1f1f;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    padding: 1rem;
`;

const HomeContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: "Noto Sans", sans-serif;
`;

const HomeAppContainer = styled.div`
    background-color: #f4f4f4;
    box-shadow: #00000052 5px 5px 30px;
    width: min(100%, 550px);
    height: 90%;
    border-radius: 1rem;
    display: flex;
    flex-direction: row;
    align-items: stretch;
`;

const SideBarNavigationContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 1rem;
    background-color: #8e44ad;
    border-radius: 1rem 0 0 1rem;
    color: white;
`;

const NavOption = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.8rem;
    border-radius: 0.5rem;
    padding: 0.8rem;
    cursor: pointer;
    &:hover {
        background-color: #ffffff36;
    }
`;

const MainContentContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    position: relative;
`;

const ScrollingFeedsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    padding-right: 1rem;
`;

const AppHeaderContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const AppLogo = styled.div`
    color: #8e44ad;
    font-weight: bold;
    font-size: 1.4rem;
`;

const RegisterPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
`;

const UserCountInfo = styled.div`
    margin: 1rem 0;
`;

const TextInputGroup = styled.div`
    background-color: black;
    border-radius: 6px;
    border: none;
    outline: none;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    flex-direction: column;
    display: flex;

    span {
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 0.6rem;
        color: #444444;
    }
`;

const CustomInput = styled.input`
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1.1rem;
    color: #e3e3e3;
`;

const SubmitButton = styled.button`
    background-color: #8e44ad;
    color: white;
    border: none;
    outline: none;
    border-bottom: #7d339c 6px solid;
    padding: 0.8rem 2rem;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover {
        transform: translateY(-2px);
    }
    &:active {
        transition: all 0.1s ease;
        transform: translateY(4px);
        border-bottom: 0;
    }
`;

export default Generate;
