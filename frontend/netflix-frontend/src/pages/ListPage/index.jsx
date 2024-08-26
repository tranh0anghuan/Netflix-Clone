import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../../utils/constants";
import { ChevronDown, Play, Plus, Trash } from "lucide-react";
import { Modal, Pagination } from "antd";
import WatchModal from "../../components/WatchModal";


function ListPage() {

  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = list.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const getList = async () => {
      try {
        const res = await axios.get(`/api/v1/list/getList`);
        setList(res.data.content);
      } catch (error) {
        console.log(error.message);
        setList([]);
      }
    };
    getList();
  }, []);

  if (list.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Search History</h1>
          <div className="flex justify-center items-center h-96">
            <p className="text-xl">No search history found</p>
          </div>
        </div>
      </div>
    );
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const handleDelete = async (entry) => {
    try {
      const res = await axios.delete(`/api/v1/list/${entry.id}`);
      setList(list.filter((item) => item.id !== entry.id));
      toast.success(res.data.message)
    } catch (error) {
        toast.error(error.response.data.message);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
          {currentData?.map((entry) => (
            <Link className="min-w-[250px] relative group" key={entry.id}>
              <div className="rounded-lg overflow-hidden">
                <img
                  src={SMALL_IMG_BASE_URL + entry.image}
                  alt="Movie image"
                  className="object-cover transition-opacity duration-300 ease-in rounded-md group-hover:opacity-90 sm:group-hover:opacity-0 delay-300 w-full h-[10vw]"
                />
              </div>
              <div
                className="absolute top-0 left-0 right-0 bottom-0 transition-transform duration-300 ease-linear z-10   
                invisible sm:visible scale-0 group-hover:scale-125 group-hover:translate-y-0   
                group-hover:opacity-100 delay-300"
              >
                <img
                  src={SMALL_IMG_BASE_URL + entry.image}
                  alt="Movie image"
                  className="object-cover transition-opacity duration-300 ease-in rounded-t-md w-full h-[10vw] z-100"
                />

                <div className="bg-gradient-to-t from-[#141414] via-transparent to-transparent absolute w-full h-[100px] top-[55px] left-0 z-10"></div>

                <div className="p-4 z-10 bg-[#141414]  absolute w-full transition rounded-b-md flex justify-between h-[120px]">
                  <div className="flex flex-row">
                    <div className="relative z-50 text-black cursor-pointer w-6 h-6 lg:w-10 lg:h-10 bg-white rounded-full flex justify-center items-center transition hover:bg-neutral-300 mr-2">
                      <Play className="fill-black size-6 " />
                    </div>

                    <div className="add-btn relative  text-white cursor-pointer w-6 h-6 lg:w-10 lg:h-10 bg-[#141414] rounded-full flex justify-center items-center transition hover:border-white border border-gray-500 mr-2">
                      <Plus className="fill-[#141414] size-6" />
                      <span className="add-sub bg-gray-300 w-[100px] top-[-50px] p-[10px] absolute rounded-md font-semibold text-black text-xs opacity-0 transform -translate-y-2 transition-opacity duration-300 ease-in-out hidden">
                        Add to My List
                      </span>
                    </div>

                    <div
                      className="trash-btn relative text-white cursor-pointer w-6 h-6 lg:w-10 lg:h-10 bg-[#141414] rounded-full flex justify-center items-center transition hover:border-white border border-gray-500"
                      onClick={() => handleDelete(entry)}
                    >
                      <Trash className="fill-[#141414] size-6" />
                      <span className=" trash-sub text-center bg-gray-300 w-[100px] top-[-50px] p-[10px] absolute rounded-md font-semibold text-black text-xs opacity-0 transform -translate-y-2 transition-opacity duration-300 ease-in-out ">
                        Remove
                      </span>
                    </div>
                  </div>

                  <div className="">
                    <div
                      className="info-btn text-white cursor-pointer w-6 h-6 lg:w-10 lg:h-10 bg-[#141414] rounded-full flex justify-center items-center transition hover:border-white border border-gray-500"
                      onClick={() => {
                        setId(entry.id);
                        showModal();
                      }}
                    >
                      <ChevronDown className="fill-[#141414] size-6" />
                      <span className=" info-sub text-center bg-gray-300 w-[120px] top-[-33px] p-[10px] absolute rounded-md font-semibold text-black text-xs opacity-0 transform -translate-y-2 transition-opacity duration-300 ease-in-out ">
                        Episodes & info
                      </span>
                    </div>
                  </div>
                </div>

                <p className="absolute top-[210px] left-0 right-0 mx-auto mt-2 text-white z-30 text-sm pl-2">
                  {entry.genre.split(",").map((g, index) => (
                    <span key={index} className="relative">
                      {index > 0 && (
                        <span className="text-gray-500 mx-1">•</span>
                      )}{" "}
                      <span className="text-white">{g.trim()}</span>
                    </span>
                  ))}
                </p>
              </div>
              <p className="mt-2 text-center">{entry.title || entry.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {currentData.length > 0 ? (
        <Pagination
          className="d-flex justify-center mb-5 bg-black"
          current={currentPage}
          total={list.length}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
        />
      ) : (
        ""
      )}

      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <WatchModal id={id}  setId={setId}/>
      </Modal>
    </div>
  )
}

export default ListPage