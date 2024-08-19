import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useContentStore } from "../../store/content";
import axios from "axios";
import { ChevronLeft, ChevronRight, Info, Play } from "lucide-react";
import ReactPlayer from "react-player";
import {
  ORIGINAL_IMG_BASE_URL,
  SMALL_IMG_BASE_URL,
} from "../../utils/constants";
import { formatDate } from "../../utils/dateFuntion";
import WatchPageSkeleton from "../../components/WatchPageSkeleton";
import { Pagination } from "antd";

function WatchModal({ id }) {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [similarContent, setSimilarContent] = useState([]);
  const { contentType } = useContentStore();
  const sliderRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = trailers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
        setTrailers(res.data.trailers);
      } catch (error) {
        if (error.message.includes("404")) {
          setTrailers([]);
        }
      }
    };
    getTrailers();
  }, [contentType, id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );
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
            <Link
              to={`/watch/${content?.id}`}
              className="bg-gray-500/70 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-4 flex items-center"
            >
              <Info className="size-6 inline-block mr-2" />
              More Info
            </Link>
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
                <p className="text-2xl">{content?.title || content?.name}</p>
              </div>
            </div>

            {trailers.length > 0 &&
              currentData.map((item) => (
                <>
                  <div className="text-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <ReactPlayer
                        controls={true}
                        width={"20%"}
                        height={"100%"}
                        className="mx-auto overflow-hidden object-cover rounded-lg"
                        url={`https:www.youtube.com/watch?v=${item.key}`}
                      />
                      <div className="flex-1 ml-5">
                        <h2 className="text-lg font-semibold"> {item.name}</h2>
                        <p className="text-gray-400">{item.site}</p>
                      </div>
                      <div className="text-gray-400">
                        {Math.floor(Math.random() * 99) + 1}m
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 my-4"></div>
                </>
              ))}
            {trailers.length === 0 && (
              <h2 className="text-xl text-center mt-5 mb-5">
                No episodes available for{" "}
                <span className="font-bold text-red-600">
                  {content?.title || content?.name}
                </span>
              </h2>
            )}

            {currentData.length > 0 ? (
              <Pagination
                className="d-flex justify-center mb-5 bg-[#141414]"
                current={currentPage}
                total={trailers.length}
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
          <div className="mt-12 max-w-5xl mx-auto relative z-100">
            <h3 className="text-2xl font-bold mb-4">More Like This</h3>

            <div
              className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group"
              ref={sliderRef}
            >
              {similarContent.map((content) => {
                if (content.poster_path === null) return null;
                return (
                  <Link
                    to={`/watch/${content.id}`}
                    className=""
                    key={content.id}
                  >
                    <div className="w-52  rounded overflow-hidden shadow-lg bg-[#2F2F2F] text-white m-2">
                      <div className="relative h-48">
                        <img
                          className="w-full h-full object-cover"
                          src={SMALL_IMG_BASE_URL + content.poster_path}
                          alt={content.title || content.name}
                        />
                      </div>
                      <div className="flex flex-col justify-between px-4 py-2 h-[200px]">
                        <div className="font-bold text-sm h-12">
                          {content.title || content.name}
                        </div>
                        <p className="text-gray-400 text-sm flex-grow">
                          {content?.overview.length > 120
                            ? content?.overview.slice(0, 120) + " ..."
                            : content?.overview}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}

              <ChevronLeft
                className="absolute top-1/2 -translate-y-1/2 left-2 size-12 rounded-full bg-black  bg-opacity-50 opacity-0 group-hover:opacity-75 text-white transition-all duration-300 cursor-pointer"
                size={24}
                onClick={scrollLeft}
              />
              <ChevronRight
                className="absolute top-1/2 -translate-y-1/2 right-2 size-12 rounded-full bg-black  bg-opacity-50 opacity-0 group-hover:opacity-75 text-white transition-all duration-300 cursor-pointer"
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
