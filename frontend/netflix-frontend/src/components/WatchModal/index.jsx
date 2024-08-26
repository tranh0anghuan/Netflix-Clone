import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useContentStore } from "../../store/content";
import axios from "axios";
import { ChevronLeft, ChevronRight, Play, Plus } from "lucide-react";
import {
  ORIGINAL_IMG_BASE_URL,
  SMALL_IMG_BASE_URL,
} from "../../utils/constants";
import { formatDate } from "../../utils/dateFuntion";
import WatchPageSkeleton from "../../components/WatchPageSkeleton";
import { Pagination, Select } from "antd";
import toast from "react-hot-toast";
import "./index.css";

function WatchModal({ id, setId }) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [similarContent, setSimilarContent] = useState([]);
  const { contentType } = useContentStore();
  const sliderRef = useRef(null);

  const [season, setSeason] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = episodes.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getEpisodesFromSelect = async (season1) => {
    try {
      setSeason(season1);
      const res = await axios.get(`/api/v1/tv/${id}/season/${season1}`);
      setEpisodes(res.data.content);
    } catch (error) {
      if (error.message.includes("404")) {
        setEpisodes([]);
      }
    }
  };

  useEffect(() => {
    const getSimilarContent = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/similar`);
        setSimilarContent(res.data.similar);
      } catch (error) {
        if (error.message.includes("404")) {
          setSimilarContent([]);
        }
      }
    };
    getSimilarContent();
  }, [contentType, id]);

  useEffect(() => {
    const getContentDetails = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/details`);
        setContent(res.data.content);
      } catch (error) {
        if (error.message.includes("404")) {
          setContent(null);
        }
      } finally {
        setLoading(false);
      }
    };
    getContentDetails();
  }, [contentType, id]);

  useEffect(() => {
    const getEpisodes = async () => {
      try {
        setSeason(1);
        const res = await axios.get(`/api/v1/tv/${id}/season/1`);
        setEpisodes(res.data.content);
      } catch (error) {
        if (error.message.includes("404")) {
          setEpisodes([]);
        }
      }
    };
    getEpisodes();
  }, [id]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  const handleAddtoList = async () => {
    try {
      const res = await axios.get(`/api/v1/list/addList/${contentType}/${id}`);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );
  }

  const numberOfSeasons = [];

  for (let i = 0; i < content.number_of_seasons; i++) {
    numberOfSeasons.push({
      value: i + 1,
      label: content.seasons[i + 1]?.name
        ? content.seasons[i + 1].name
        : `Season ${i + 1}`,
    });
  }

  return (
    <div className="text-white w-full h-full">
      <div className="mx-auto container px-4 py-8 h-full">
        <img
          src={ORIGINAL_IMG_BASE_URL + content?.backdrop_path}
          alt="hero img"
          className="w-full rounded-lg"
        />

        <div className="max-w-2xl relative bottom-[200px] left-[40px] z-20">
          <h1 className=" mt-4 text-4xl font-extrabold text-balance ">
            {content?.title || content?.name}
          </h1>
          <div className="flex mt-8">
            <Link
              to={`/watch/${content?.id}`}
              className="bg-white hover:bg-white/80 text-black font-bold py-2 px-4 rounded mr-4 flex items-center"
            >
              <Play className="size-6 inline-block mr-2 fill-black" />
              Play
            </Link>
            <div
              onClick={() => {
                handleAddtoList();
              }}
              className="bg-gray-500/70 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-4 flex items-center hover:cursor-pointer"
            >
              <Plus className="size-6 inline-block mr-2" />
              My List
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-t from-[#141414] via-transparent to-transparent absolute w-full h-[100px] top-[360px] left-0 z-10"></div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-2 max-w-6xl mx-auto mt-[-120px]">
          {/* Left Content */}
          <div className="w-full md:w-3/5 mb-4 md:mb-0">
            <p className="text-lg">
              {formatDate(content?.release_date || content?.first_air_date)} |{" "}
              {content?.adult ? (
                <span className="text-red-600">18+</span>
              ) : (
                <span className="text-green-600">PG-13</span>
              )}
            </p>
            <p className="mt-4 text-lg">
              {content?.overview.length > 150
                ? content?.overview.slice(0, 150) + " ..."
                : content?.overview}
            </p>
          </div>

          {/* Right Content */}
          <div className="w-full md:w-2/5 mb-4 md:mb-0 md:ml-10">
            <p className="mt-2 text-sm">
              <span className="text-gray-600 mr-2">Genres:</span>
              {content?.genres.map((genre) => genre.name).join(", ")}
            </p>
            <p className="mt-2">
              <span className="text-gray-600 mr-2">Production Companies:</span>
              {content?.production_companies
                .map((company) => company.name)
                .join(", ")}
            </p>
          </div>
        </div>

        {contentType !== "movie" ? (
          <>
            <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto mt-16 mb-5">
              <div className="w-full md:w-auto mb-4 md:mb-0">
                <p className="text-2xl">Episodes</p>
              </div>

              <div className="w-full md:w-auto mb-4 md:mb-0">
                <Select
                  value={season}
                  style={{
                    width: 120,
                  }}
                  onChange={(season) => {
                    getEpisodesFromSelect(season);
                  }}
                  options={numberOfSeasons}
                />
              </div>
            </div>

            {episodes?.length > 0 &&
              currentData.map((item) => (
                <>
                  <div className="text-white p-4 rounded-lg shadow-md pr-[50px]">
                    <div className="flex items-center">
                      <img
                        src={ORIGINAL_IMG_BASE_URL + item?.still_path}
                        width={"20%"}
                        height={"100%"}
                        className="mx-auto overflow-hidden object-cover rounded-lg"
                      />
                      <div className="flex-1 ml-5">
                        <h2 className="text-lg font-semibold flex justify-between">
                          {" "}
                          {item.name}
                          <div className="text-white ml-[30px]">
                            {item.runtime}m
                          </div>
                        </h2>
                        <p className="text-gray-400">
                          {item?.overview.length > 200
                            ? item?.overview.slice(0, 200) + " ..."
                            : item?.overview}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 my-4"></div>
                </>
              ))}
            {episodes?.length === 0 && (
              <h2 className="text-xl text-center mt-5 mb-5">
                No episodes available for{" "}
                <span className="font-bold text-red-600">
                  {content?.title || content?.name}
                </span>
              </h2>
            )}

            {currentData?.length > 0 ? (
              <Pagination
                className="d-flex justify-center mb-5 bg-[#141414]"
                current={currentPage}
                total={episodes.length}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
              />
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
        {similarContent.length > 0 && (
          <div className="mt-12 max-w-5xl mx-auto relative ">
            <h3 className="text-2xl font-bold mb-4">More Like This</h3>

            <div
              className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group"
              ref={sliderRef}
            >
              {similarContent.map((content) => {
                if (content.poster_path === null) return null;
                return (
                  <div
                    onClick={() => {
                      setId(content.id);
                    }}
                    className="hover:scale-105 transition-transform duration-300 ease-linear cursor-pointer"
                    key={content.id}
                  >
                    <div className=" relative w-52  rounded overflow-hidden shadow-lg bg-[#2F2F2F] text-white m-2">
                      <div className="relative h-48">
                        <img
                          className="w-full h-full object-cover"
                          src={SMALL_IMG_BASE_URL + content.poster_path}
                          alt={content.title || content.name}
                        />
                      </div>

                      <div className="bg-gradient-to-t from-[#2F2F2F] via-transparent to-transparent absolute w-full h-[150px] top-[43px] left-0 z-10"></div>

                      <div className="flex flex-col justify-between px-4 py-2 h-[200px]">
                        <div className="font-bold text-sm h-12">
                          {(content.title?.length > 35
                            ? content?.title.slice(0, 35) + " ..."
                            : content?.title) ||
                            (content.name?.length > 35
                              ? content?.name.slice(0, 35) + " ..."
                              : content?.name)}
                        </div>
                        <p className="text-gray-400 text-sm flex-grow">
                          {content?.overview.length > 120
                            ? content?.overview.slice(0, 120) + " ..."
                            : content?.overview}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <ChevronLeft
                className="absolute top-1/2 -translate-y-1/2 left-2 size-12 rounded-full bg-black  bg-opacity-50 opacity-0 group-hover:opacity-75 text-white transition-all duration-300 cursor-pointer z-20"
                size={24}
                onClick={scrollLeft}
              />
              <ChevronRight
                className="absolute top-1/2 -translate-y-1/2 right-2 size-12 rounded-full bg-black  bg-opacity-50 opacity-0 group-hover:opacity-75 text-white transition-all duration-300 cursor-pointer z-20"
                size={24}
                onClick={scrollRight}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchModal;
