import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

var result = [];
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

export async function search(req, res) {
  const { type, query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/${type}?query=${query}&include_adult=false&language=en-US&page=1`
    );
    if (response.results.length === 0) {
      return res.status(404).send(null);
    }
    result = response.results;

    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.log("Error in search controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

const fetchGenresAndMapNames = async (searchResult, type) => {
  const genres = await getGenre(type);
  const names = searchResult.genre_ids
    .map((id) => {
      const genre = genres.find((item) => item.id === id);
      return genre ? genre.name : null;
    })
    .filter((name) => name !== null);

  const limitNames = names.slice(0, 3);
  const concatenatedNames = limitNames.join(", ");
  return concatenatedNames; // Return the concatenated names
};

export async function addSearchHistory(req, res) {
  const { type, id } = req.params;
  try {
    if (result.length === 0) {
      return res.status(404).send(null);
    }

    const searchResult = result.find((r) => r.id === parseInt(id));

    const userId = req.user._id;
    const searchId = searchResult.id;

    const user = await User.findById(userId);

    // Check if the searchResult.id already exists in searchHistory
    const alreadyExists = user.searchHistory.some(
      (history) => history.id === searchId
    );

    const concatenatedNames = await fetchGenresAndMapNames(searchResult, type);

    if (!alreadyExists) {
      // If it doesn't exist, push the new search result to the searchHistory array
      await User.findByIdAndUpdate(userId, {
        $push: {
          searchHistory: {
            id: searchId,
            image: searchResult.backdrop_path,
            title: searchResult.name || searchResult.title,
            searchType: type,
            createdAt: new Date(),
            genre: concatenatedNames,
          },
        },
      });
      res.status(200).json({ success: true, content: searchResult });
    } else {
      res.status(500).json({
        success: false,
        message: "This search result is already in the search history.",
      });
    }
  } catch (error) {
    console.log("Error in search controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getSearchHistory(req, res) {
  try {
    res.status(200).json({ success: true, content: req.user.searchHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function removeItemFromSearchHistory(req, res) {
  let { id } = req.params;

  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        searchHistory: { id: parseInt(id) },
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Item removed from search history" });
  } catch (error) {
    console.log(
      "Error in removeItemFromSearchHistory controller: ",
      error.message
    );
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
