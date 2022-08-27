import { css } from "@emotion/css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";
import { ownerAddress } from "../constants";

const Navbar = () => {
  const { address } = useAccount();

  return (
    <nav className={nav}>
      <div className={header}>
        <Link href="/">
          <a>
            <Image
              src="https://images.unsplash.com/photo-1621501103258-3e135c8c1fda?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80"
              alt="React Logo"
              width={50}
              height={50}
            />
          </a>
        </Link>
        <Link href="/">
          <a>
            <div className={titleContainer}>
              <h2 className={title}>Decen Blog</h2>
            </div>
          </a>
        </Link>
        <ConnectButton />
      </div>
      <div className={linkContainer}>
        <Link href="/">
          <a className={link}>Home</a>
        </Link>
        {address === ownerAddress && (
          <Link href="/create-post">
            <a className={link}>Create Post</a>
          </Link>
        )}
      </div>
    </nav>
  );
};

const linkContainer = css`
  padding: 30px 60px;
  background-color: #fafafa;
`;

const nav = css`
  background-color: white;
`;

const header = css`
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.075);
  padding: 20px 30px;
  justify-content: space-between;
  align-items: center;
`;

const titleContainer = css`
  display: flex;
  flex-direction: column;
  padding-left: 15px;
`;

const title = css`
  margin-left: 30px;
  font-weight: 500;
  margin: 0;
`;

const link = css`
  margin: 0px 40px 0px 0px;
  font-size: 16px;
  font-weight: 400;
`;

export default Navbar;
