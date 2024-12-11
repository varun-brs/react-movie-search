export const getImageUrl = (moviePoster) => {
  if (moviePoster === "N/A") {
    return process.env.PUBLIC_URL + "/assets/img/notFound.jpg";
  }
  return moviePoster;
};
