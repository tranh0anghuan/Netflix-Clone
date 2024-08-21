import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

var genres = [];

const getGenre = async (type) => {
  try {
    // Ensure to replace 'YOUR_API_KEY' with your actual TMDB API key.
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/genre/${type}/list?language=en`
    );

    if (!response || !response.genres) {
      throw new Error("Invalid response structure.");
    }

    return response.genres;
  } catch (error) {
    console.error("Error in getGenre function: ", error);
    return [];
  }
};


export async function addList(req, res) {
  const { type, id } = req.params;
  try {


    const response = await fetchFromTMDB(
        `https://api.themoviedb.org/3/${type}/${id}?language=en-US`
      );

    const userId = req.user._id;
    const resultId = response.id;

    const user = await User.findById(userId);

    const alreadyExists = user.list.some(
      (item) => item.id === resultId
    );


    if (!alreadyExists) {
      await User.findByIdAndUpdate(userId, {
        $push: {
          list: {
            id: resultId,
            image: response.backdrop_path,
            title: response.name || response.title,
            searchType: type,
            createdAt: new Date(),
            genre: response.genres.map(genre => genre.name).join(", "),
          },
        },
      });
      res.status(200).json({ success: true,message: "Add to your list successfully." , content: response });
    } else {
      res.status(500).json({
        success: false,
        message: "This item is already in list.",
      });
    }
  } catch (error) {
    console.log("Error in list controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getList(req, res) {
  try {
    res.status(200).json({ success: true, content: req.user.list });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function removeItemFromList(req, res) {
  let { id } = req.params;

  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        list: { id: parseInt(id) },
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Item removed from search history" });
  } catch (error) {
    console.log(
      "Error in list controller: ",
      error.message
    );
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
