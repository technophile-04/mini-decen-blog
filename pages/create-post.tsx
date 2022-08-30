/* pages/create-post.js */
import { useState, useRef, useEffect, ChangeEvent } from "react"; // new
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { css } from "@emotion/css";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
import "easymde/dist/easymde.min.css";
import axios from "axios";

import contractAddresses from "../contracts/contract-addresses.json";

import Blog from "../contracts/Blog.json";
import { NextPage } from "next";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import Navbar from "../components/Navbar";

// const client = create({
//   url: "https://api-eu1.tatum.io/v3/ipfs",
//   headers: {
//     "Content-Type": "multipart/form-data",
//     "x-api-key": process.env.NEXT_PUBLIC_IPFS_API_KEY!,
//   },
// });

/* configure the markdown editor to be client-side import */

const initialState = { title: "", content: "", coverImage: "" };

console.log("Contract Address", contractAddresses[31337][0]);

const contractConfig = {
  addressOrName: contractAddresses[31337][0],
  contractInterface: Blog.abi,
};

const CreatePost: NextPage = () => {
  /* configure initial state to be used in the component */
  const [post, setPost] = useState<typeof initialState>(initialState);
  const [image, setImage] = useState<File | null>(null);
  const [loaded, setLoaded] = useState<Boolean>(false);
  const { address } = useAccount();

  const {
    writeAsync: createPost,
    isLoading: isCreatePostLoading,
    isSuccess: isCreatePostSuccess,
    error: createPostError,
  } = useContractWrite({
    addressOrName: contractAddresses[31337][0],
    contractInterface: Blog.abi,
    functionName: "createPost",
    mode: "recklesslyUnprepared",
    onError(err) {
      console.log(err);
    },
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const { title, content } = post;
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      /* delay rendering buttons until dynamic import is complete */
      setLoaded(true);
    }, 500);
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target) {
      setPost((prevPost) => ({ ...prevPost, [e.target.name]: e.target.value }));
    } else {
      setPost((prevPost) => ({ ...prevPost }));
    }
  };

  async function createNewPost() {
    /* saves post to ipfs then anchors to smart contract */
    if (!title || !content) return;
    const hash = await savePostToIpfs();
    if (hash) {
      await savePost(hash);
    } else {
      console.error("Didnt get the hash");
    }
    // router.push(`/`);
  }

  async function savePostToIpfs() {
    /* save post metadata to ipfs */
    try {
      // const added = await client.add(JSON.stringify(post));
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_NFT_STORAGE}`,
        },
      };

      const { data } = await axios.post(
        "https://api.nft.storage/upload",
        JSON.stringify(post),
        config
      );

      console.log("Ipf json data", data);

      return data.value.cid;
    } catch (err) {
      console.log("error: ", err);
    }
  }

  async function savePost(hash: string) {
    /* anchor post to smart contract */
    let val;
    try {
      if (createPost) {
        const txnRecp = await createPost?.({
          recklesslySetUnpreparedArgs: [post.title, hash],
        });
        await txnRecp.wait();
      } else {
        console.log("No CreatePOst");
      }
      console.log("val: ", val);
    } catch (err) {
      console.log("Error: ", err);
    }
  }

  function triggerOnChange() {
    /* trigger handleFileChange handler of hidden file input */
    if (fileRef.current) {
      fileRef.current.click();
    }
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    /* upload cover image to ipfs and save hash to state */
    let uploadedFile;
    if (e && e.target && e.target.files) {
      uploadedFile = e.target.files[0];
    }
    if (!uploadedFile) return;
    // const added = await client.add(uploadedFile);
    const form = new FormData();
    console.log(uploadedFile);
    form.append("file", uploadedFile);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-api-key": process.env.NEXT_PUBLIC_IPFS_API_KEY!,
      },
    };

    const { data } = await axios.post(
      "https://api-eu1.tatum.io/v3/ipfs",
      form,
      config
    );

    console.log("IPFS uploaded", data);

    setPost((state) => ({ ...state, coverImage: data.ipfsHash }));
    setImage(uploadedFile);
  }

  return (
    <>
      <Navbar />
      <div className={container}>
        {image && (
          <img className={coverImageStyle} src={URL.createObjectURL(image)} />
        )}
        <input
          onChange={onChange}
          name="title"
          placeholder="Give it a title ..."
          value={post.title}
          className={titleStyle}
        />
        <SimpleMDE
          placeholder="Hello World"
          className={mdEditor}
          value={post.content}
          onChange={(value) => setPost({ ...post, content: value })}
        />
        {loaded && (
          <>
            <button className={button} type="button" onClick={createNewPost}>
              Publish
            </button>
            <button onClick={triggerOnChange} className={button}>
              Add cover image
            </button>
          </>
        )}
        <input
          id="selectImage"
          className={hiddenInput}
          type="file"
          onChange={handleFileChange}
          ref={fileRef}
        />
      </div>
    </>
  );
};

const hiddenInput = css`
  display: none;
`;

const coverImageStyle = css`
  max-width: 800px;
`;

const mdEditor = css`
  margin-top: 40px;
`;

const titleStyle = css`
  margin-top: 40px;
  border: none;
  outline: none;
  background-color: inherit;
  font-size: 44px;
  font-weight: 600;
  &::placeholder {
    color: #999999;
  }
`;

const container = css`
  width: 800px;
  margin: 0 auto;
`;

const button = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 18px;
  padding: 16px 70px;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

export default CreatePost;
