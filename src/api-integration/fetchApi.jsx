import axios from "axios";

export const fetchDataFromAPI = (method, url, body, requestHeaders, form) => {
	let contentType;
	if (form === true) {
		contentType = "multipart/form-data";
	} else {
		contentType = "application/json";
	}
	let reqHeader = {
		// "Content-Type": contentType,
		Authorization: "Bearer " + localStorage.getItem("token"),
		...requestHeaders,
	};

	switch (method) {
		case "GET": {
			return new Promise((resolve, reject) => {
				axios
					.get(url, {
						headers: reqHeader,
					})
					.then((res) => {
						resolve(res.data);
					})
					.catch((err) => {
						reject(err.response?.data);
						if (
							err?.response?.status === 401 ||
							err?.response?.status === 403
						) {
							localStorage.removeItem("token");
							setTimeout(() => {
								window.location.href = "/login";
							}, 2000);
						}
					});
			});
		}
		case "POST": {
			console.log("body: ", method, url, body, reqHeader, form);

			return new Promise((resolve, reject) => {
				axios
					.post(url, body, {
						headers: reqHeader,
					})
					.then((res) => {
						console.log("resolved: ", res);
						resolve(res.data);
					})
					.catch((err) => {
						console.log("rejected: ", err);
						reject(err.response?.data);
						if (
							err?.response?.status === 401 ||
							err?.response?.status === 403
						) {
							localStorage.removeItem("token");
							setTimeout(() => {
								window.location.href = "/login";
							}, 2000);
						}
					});
			});
		}

		case "DELETE": {
			return new Promise((resolve, reject) => {
				axios
					.delete(url, { headers: reqHeader })
					.then((res) => {
						resolve(res.data);
					})
					.catch((err) => {
						reject(err.response.data);
						if (
							err?.response?.status === 401 ||
							err?.response?.status === 403
						) {
							localStorage.removeItem("token");
							setTimeout(() => {
								window.location.href = "/login";
							}, 2000);
						}
					});
			});
		}

		case "PUT": {
			return new Promise((resolve, reject) => {
				axios
					.put(url, body, {
						headers: reqHeader,
					})
					.then((res) => {
						resolve(res.data);
					})
					.catch((err) => {
						reject(err.response?.data);
						if (
							err?.response?.status === 401 ||
							err?.response?.status === 403
						) {
							localStorage.removeItem("token");
							setTimeout(() => {
								window.location.href = "/login";
							}, 2000);
						}
					});
			});
		}
		default: {
			return new Promise((resolve, reject) => {
				axios
					.get(url, {
						headers: reqHeader,
					})
					.then((res) => {
						resolve(res.data);
					})
					.catch((err) => {
						reject(err.response.data);
						if (
							err?.response?.status === 401 ||
							err?.response?.status === 403
						) {
							localStorage.removeItem("token");
							setTimeout(() => {
								window.location.href = "/login";
							}, 2000);
						}
					});
			});
		}
	}
};
