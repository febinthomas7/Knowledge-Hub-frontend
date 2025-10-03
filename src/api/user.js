import api from "./api";

export const createTeam = async (credentials) => {
  const res = await api.post("/api/user/create-team", credentials);
  return res.data;
};

export const teamFeed = async () => {
  const res = await api.get(
    `/api/user/feed?userId=${localStorage.getItem("userId")}`
  );
  return res.data;
};

export const team = async () => {
  const res = await api.get(
    `/api/user/my-teams?userId=${localStorage.getItem("userId")}`
  );
  return res.data;
};

export const generateTags = async (credentials) => {
  const res = await api.post("/api/user/get-tags", credentials);
  return res.data;
};

export const generateSummary = async (credentials) => {
  const res = await api.post("/api/user/get-tags", credentials);
  return res.data;
};

export const fetcDoc = async (credentials) => {
  const { id } = credentials;
  const res = await api.get(`/api/user/document?docId=${id}`);
  return res.data;
};

export const createDoc = async (credentials) => {
  const { teamId, user, role } = credentials;
  const res = await api.post(
    `/api/user/document?team=${teamId}&userId=${user}&role=${role}`,
    credentials
  );
  return res.data;
};

export const updateDoc = async (credentials) => {
  const { id, user } = credentials;
  const res = await api.put(
    `/api/user/document/${id}?userId=${user}`,
    credentials
  );
  return res.data;
};

export const deleteDoc = async (credentials) => {
  const { docId, user } = credentials;
  const res = await api.delete(
    `/api/user/document?docId=${docId}&userId=${user}`
  );
  return res.data;
};

export const deleteUser = async (credentials) => {
  const { teamId, memberId, user } = credentials;
  const res = await api.delete(
    `/api/user/team/${teamId}/member/${memberId}?userId=${user}`
  );
  return res.data;
};

export const inviteUser = async (credentials) => {
  const { email, teamId } = credentials;
  const res = await api.post(`/api/user/team/${teamId}/invite`, credentials);
  return res.data;
};

export const userConversation = async (credentials) => {
  const res = await api.post(
    `/api/user/ask?userId=${localStorage.getItem("userId")}`,
    credentials
  );
  return res.data;
};

export const userSearch = async (credentials) => {
  const res = await api.post(
    `/api/user/search?userId=${localStorage.getItem("userId")}`,
    credentials
  );
  return res.data;
};

export const userResetPassword = async (credentials) => {
  const res = await api.post(`/api/auth/verify-otp`, credentials);
  return res.data;
};

export const userRequestPassword = async (credentials) => {
  const res = await api.post(`/api/auth/request-reset`, credentials);
  return res.data;
};

export const userDocuments = async () => {
  const res = await api.get(
    `/api/user/docs?userId=${localStorage.getItem("userId")}`
  );
  return res.data;
};

export const userUploadDocuments = async (credentials) => {
  const res = await api.post(`/api/user/doc-upload`, credentials);
  return res.data;
};

export const userDeleteDocuments = async (id) => {
  const res = await api.post(`/api/user/delete/${id}`);
  return res.data;
};

export const getDocToken = async (fileId, gridId, type) => {
  const res = await api.get(
    `/api/user/get-token/${fileId}?name=${localStorage.getItem(
      "name"
    )}&userId=${localStorage.getItem("userId")}&gridId=${gridId}&type=${type}`
  );
  return res.data;
};
