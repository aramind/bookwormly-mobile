import "dotenv/config";

export default {
  expo: {
    name: "bookwormly",
    version: "1.0.0",
    extra: {
      API_URL: process.env.API_URL,
    },
  },
};
