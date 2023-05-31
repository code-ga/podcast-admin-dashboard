"use client";
import React from "react";
import Logo from "./Group_6.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function Navbar() {
  return (
    <header className="flex items-center justify-between px-10 m-5 my-10 text-white bg-indigo-900 border rounded-2xl">
      <Image
        src={Logo}
        alt={""}
        className="w-10 h-10 justify-self-start"
      ></Image>
      <div className="flex items-center justify-center ">
        <Item>
          <Link href={"/playlist"}>
            <LinkButton path={"/playlist"}>Playlist</LinkButton>
          </Link>
        </Item>
        <Item>
          <Link href={"/song"}>
            <LinkButton path={"/song"}>Song</LinkButton>
          </Link>
        </Item>
      </div>
    </header>
  );
}

const Item: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <h1 className="mx-5">{children}</h1>
    </>
  );
};

const LinkButton: React.FC<React.PropsWithChildren<{ path: string }>> = ({
  children,path
}) => {
  const pathname = usePathname();
  return (
    <button className={`p-1 px-2 m-1.5 rounded-xl hover:bg-slate-500 ${pathname== path ? "bg-slate-500":""}`}>
      {children}
    </button>
  );
};
