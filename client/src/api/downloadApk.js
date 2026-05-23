import axios from "axios";

export const downloadApkAPI = {
	getSignedApkUrl: () => axios.get("/api/ecocollect/download-apk/apk-url"),
};
