import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

export const getStat = async (req, res, next) => {
  try {
    const [totalSongs, totalAlbums, uniqueArtist, totalUsers] =
      await Promise.all([
        Song.countDocuments(),
        Album.countDocuments(),
        Song.aggregate([
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },
          {
            $group: {
              _id: "$artist",
            },
          },
          { $count: "count" },
        ]),
        User.countDocuments(),
      ]);

    return res.status(200).json({
      totalSongs,
      totalAlbums,
      uniqueArtist: uniqueArtist[0]?.count || 0,
      totalUsers,
    });
  } catch (error) {
    next(error);
  }
};
