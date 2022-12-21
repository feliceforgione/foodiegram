async function handleImageUpload(image) {
  const url = "https://api.cloudinary.com/v1_1/duxswkatb/image/upload";
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
  data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
  const response = await fetch(url, {
    method: "POST",
    accept: "application/json",
    body: data,
  });

  const jsonResponse = await response.json();
  console.log(jsonResponse);

  return jsonResponse.url;
}

export default handleImageUpload;
