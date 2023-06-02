import Image from "next/image";
import { prisma } from "~/db";
import { notFound } from "next/navigation";

async function GetPlaylistById(id: string) {
  "use server";
  try {
    return prisma.playlist.findUnique({
      where: {
        id,
      },
      include: {
        itunesCategory: true,
        itunesOwner: true,
      },
    });
  } catch {
    return null;
  }
}
export default async function PlaylistInfo({
  params,
}: {
  params: { id: string };
}) {
  const playlist = await GetPlaylistById(params.id);
  if (!playlist) {
    notFound();
    return <></>;
  }
  return (
    <div className="pt-5 grid gap-1 grid-cols-4">
      <div className="col-span-3 p-4 rounded-lg">
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
                  className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ></input>
              </div>
            );
          } else if (typeof value == "boolean") {
            return <></>;
          } else if (value instanceof Array) {
            value;
            return <></>;
          } else if (value instanceof Date) {
            return <></>;
          } else {
            return <></>;
          }
        })}
      </div>
      <div className=" p-4 rounded-lg flex justify-center items-center text-center">
        <Image
          src={playlist.imageUrl}
          alt=""
          width={100}
          height={100}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
