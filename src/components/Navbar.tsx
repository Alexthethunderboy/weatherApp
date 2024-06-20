import React from "react";
import { MdMyLocation, MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import SearchBox from "./SearchBox";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-gray-700">
      <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-gray-200 text-3xl">Weather</h2>
          <MdWbSunny className="text-3xl mt-1 text-red-300" />
        </div>
        {/*  */}
        <section className="flex gap-2 items-center">
          <MdMyLocation className="text-2xl text-gray-200 hover:opacity-80 cursor-pointer" />
          <MdOutlineLocationOn className="text-3xl text-gray-400 " />
          <p className="text-slate-200/80 text-sm">Nigeria</p>
          <div>
            {/* Seatrchbox */}
            <SearchBox />
          </div>
        </section>
      </div>
    </nav>
  );
}
