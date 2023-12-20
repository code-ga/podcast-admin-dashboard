"use client";
import { FeedItunesCategory, FeedItunesOwner, Playlist } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { updatePlaylist } from "../database";

export const ShowPlaylistField: React.FC<{
  playlist:
    | Playlist & {
        itunesOwner: FeedItunesOwner;
        itunesCategory: FeedItunesCategory[];
      };
}> = ({ playlist }) => {
  "use client";
  const router = useRouter();
  const [changeData, setChangeData] = useState({ ...playlist });
  const handlerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const ChangeKey = e.target.name;
    let ChangeValue:
      | string
      | boolean
      | FeedItunesOwner
      | FeedItunesCategory[]
      | string[]
      | Date = e.target.type == "checkbox" ? e.target.checked : e.target.value;
    if (ChangeKey == "id") return;
    setChangeData({ ...changeData, [ChangeKey]: ChangeValue });
  };
  const handlerSubmit = async () => {
    console.log(changeData);
    const updateData = new Map();
    // compare data between changeData and playlist
    Object.keys(changeData).forEach((key) => {
      const changeValue = changeData[key as keyof typeof changeData];
      const playlistValue = playlist[key as keyof typeof playlist];

      if (changeValue != playlistValue) {
        updateData.set(key, changeValue);
        console.log({ key, changeValue, playlistValue });
      }
    });
    if (updateData.size == 0) {
      alert("No data to update");
      return router.push("/playlist");
    }
    console.log(updateData);
    const data = await updatePlaylist(
      playlist.id,
      Object.fromEntries(updateData)
    );
    console.log(data);
    router.push("/playlist");
  };
  return (
    <>
      {Object.keys(changeData).map((key, index) => {
        const value = changeData[key as keyof typeof changeData];
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
          console.log({ key, value });
          return (
            <div key={index}>
              {value.map((e, index) => (
                <div key={index}>{e instanceof String ? e : e.toString()}</div>
              ))}
            </div>
          );
        } else if (value instanceof Date) {
          console.log(key);
          return <></>;
        } else {
          return <></>;
        }
      })}
      <button
        className="p-3 mb-1 rounded bg-sky-900 hover:bg-sky-700"
        onClick={handlerSubmit}
      >
        save change
      </button>
    </>
  );
};
