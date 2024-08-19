import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

var result = [];

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
    console.log("Error in searchPerson controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

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

    if (!alreadyExists) {
      // If it doesn't exist, push the new search result to the searchHistory array
      await User.findByIdAndUpdate(userId, {
        $push: {
          searchHistory: {
            id: searchId,
            image: searchResult.poster_path || searchResult.profile_path,
            title: searchResult.name || searchResult.title,
            searchType: type,
            createdAt: new Date(),
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
    console.log("Error in searchPerson controller: ", error.message);
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
