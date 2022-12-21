import { Cloudinary } from "cloudinary-core";

const cld = new Cloudinary({
  cloud: {
    cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
    api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
  },
});

export default cld;
