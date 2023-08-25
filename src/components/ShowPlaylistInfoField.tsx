"use client";
import { FeedItunesCategory, FeedItunesOwner, Playlist } from "@prisma/client";
import { ChangeEvent, useState } from "react";

export const ShowPlaylistField: React.FC<{
  playlist:
    | Playlist & {
        itunesOwner: FeedItunesOwner;
        itunesCategory: FeedItunesCategory[];
      };
}> = ({ playlist }) => {
  "use client";
  const [changeData, setChangeData] = useState({});
  const handlerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const ChangeKey = e.target.name;
    let ChangeValue:
      | string
      | boolean
      | FeedItunesOwner
      | FeedItunesCategory[]
      | string[]
      | Date;
    if (e.target.type == "text") {
      ChangeValue = e.target.value;
    }
    if (e.target.type == "checkbox") {
      ChangeValue = e.target.checked;
    }
    console.log({ ChangeKey, ChangeValue });
  };
  return (
    <>
      {Object.keys(playlist).map((key, index) => {
        const value = playlist[key as keyof typeof playlist];
        if (typeof value == "string") {
          return (
            <div key={index} className="mb-6">
              <label
                htmlFor={key}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {key}
              </label>
              <br />
              <input
                value={value}
                id={key}
                name={key}
                onChange={handlerChange}
                className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              ></input>
            </div>
          );
        } else if (typeof value == "boolean") {
          return (
            <div key={index}>
              <label
                htmlFor={key}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {key}
              </label>
              <br />
              <input
                checked={value}
                id={key}
                name={key}
                onChange={handlerChange}
                className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="checkbox"
              ></input>
            </div>
          );
        } else if (value instanceof Array) {
          value;
          return <></>;
        } else if (value instanceof Date) {
          return <></>;
        } else {
          return <></>;
        }
      })}
      <button className={``}>save change</button>
    </>
  );
};
