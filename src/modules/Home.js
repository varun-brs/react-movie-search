import { useState, createRef, useEffect, useMemo } from "react";
import { HttpGet } from "../core/store/httpHelper";
import { Card } from "../core/components/Card";
import { getImageUrl } from "../core/common/helpers";
import Modal from "react-modal";
Modal.setAppElement(document.getElementById("root"));

export const Home = () => {
  const [moviesList, setMoviesList] = useState([]);
  const [page, setPage] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [totalMovies, setTotalMovies] = useState(0);
  const [block, setBlock] = useState(false);
  const [toggleFlag, setToggleFlag] = useState(false);
  let searchRef = createRef();

  const MoviesList = () => {
    return (
      !!moviesList.length &&
      moviesList.map((movie, index) => {
        return (
          <Card
            handleMovieClick={handleMovieClick}
            key={index}
            movie={movie}
            setShowModal={setIsOpen}
            setSelectedMovie={setSelectedMovie}
          />
        );
      })
    );
  };

  // eslint-disable-next-line
  const MemoizedMoviesList = useMemo(() => MoviesList, [moviesList]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        if (!block) {
          setPage((p) => p + 1);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [block]);

  useEffect(() => {
    if (totalMovies && totalMovies === moviesList.length) {
      setBlock(true);
    }
    // eslint-disable-next-line
  }, [totalMovies, moviesList, block]);

  useEffect(() => {
    const searchMovies = async () => {
      let searchQuery = searchRef?.current?.value;
      if (searchQuery) {
        let queryParams = {
          s: searchQuery,
          page: page,
          y: "",
        };
        let movielList = await HttpGet(queryParams);
        if (movielList?.Response === "False") {
          setMoviesList([]);
        } else {
          if (!totalMovies) {
            setTotalMovies(Number(movielList?.totalResults));
          }
          if (moviesList) {
            setMoviesList((mList) => [...mList, ...movielList?.Search]);
          } else {
            setMoviesList(movielList?.Search);
          }
        }
      } else {
        setPage(1);
        setMoviesList([]);
      }
    };
    if (page) {
      if (totalMovies === 0 || moviesList.length !== totalMovies) {
        searchMovies();
      }
    }
    // eslint-disable-next-line
  }, [page, toggleFlag]);

  const getMovieDetails = async (movie) => {
    let queryParams = {
      i: movie?.imdbID,
    };
    let movieDetails = await HttpGet(queryParams);
    setIsOpen(true);
    setSelectedMovie(movieDetails);
  };

  const customStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "none",
      cursorEvents: "none",
    },
    content: {
      position: "absolute",
      top: "5%",
      left: "20%",
      right: "20%",
      bottom: "5%",
      border: "1px solid #ccc",
      background: "#fff",
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      borderRadius: "4px",
      outline: "none",
      padding: "20px",
    },
  };

  const handleMovieClick = (movie) => {
    getMovieDetails(movie);
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    setBlock(false);
    setTotalMovies(0);
    setMoviesList([]);
    setPage(1);
    setToggleFlag(!toggleFlag);
  };

  return (
    <>
      <div className="row m-0 justify-content-lg-center">
        <div className="col col-12 mt-4">
          <form onSubmit={handleButtonClick}>
            <div className="input-group mb-3">
              <input
                name="search"
                ref={searchRef}
                type="text"
                className="form-control shadow-none w-100"
                placeholder="Search for a Movie Name"
                aria-label="Search for a Movie Name"
                aria-describedby="img-search"
                autoFocus
              />
            </div>
          </form>
        </div>
        <div className="col col-12">
          <MemoizedMoviesList />
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        defaultStyles={customStyles}
        contentLabel="Example Modal"
      >
        <div className="row w-100 m-0">
          <div className="col col-11">
            <h4>{selectedMovie?.Title}</h4>
          </div>
          <div className="col col-1">
            <button
              className="border-0 bg-transparent"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>
          </div>
        </div>
        <div className="row w-100 m-0 mt-3">
          <div className="col col-5">
            <img
              className="w-100"
              src={getImageUrl(selectedMovie?.Poster)}
              alt={selectedMovie?.Title}
            />
          </div>
          <div className="col col-7">
            <p className="fw-bold">Genre</p>
            <p>{selectedMovie?.Genre}</p>
            <p className="fw-bold">Release</p>
            <p>{selectedMovie?.Released}</p>
            <p className="fw-bold">Director</p>
            <p>{selectedMovie?.Director}</p>
            <p className="fw-bold">Writer</p>
            <p>{selectedMovie?.Writer}</p>
            <p className="fw-bold">Actors</p>
            <p>{selectedMovie?.Actors}</p>
            <p className="fw-bold">Plot</p>
            <p>{selectedMovie?.Plot}</p>
            <p className="fw-bold">Rating</p>
            <p>{selectedMovie?.imdbRating}</p>
          </div>
        </div>
      </Modal>
    </>
  );
};
