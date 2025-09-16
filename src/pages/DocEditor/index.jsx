import { useState, useEffect } from "react";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { useParams, useLocation } from "react-router-dom";

const DocEditor = () => {
  const { id } = useParams();
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const filename = query.get("fieldId");
  const type = query.get("type");
  const [fileId] = useState(filename);
  const [gridId] = useState(id);
  const [config, setConfig] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/api/user/get-token/${fileId}?name=${localStorage.getItem(
        "name"
      )}&userId=${localStorage.getItem("userId")}&gridId=${gridId}&type=${type}`
    )
      .then((res) => res.json())
      .then((data) => {
        setConfig(data.config);
        setToken(data.token);
        console.log(data);
      })
      .catch((err) => console.error(err));
  }, [fileId]);

  if (!config || !token) return <div>Loading...</div>;

  return (
    <div style={{ height: "100vh" }}>
      <DocumentEditor
        id="docEditor"
        documentServerUrl={import.meta.env.VITE_ONLYOFFICE_SERVER_URL}
        config={{
          ...config,
          token, // JWT token must be inside config
        }}
        headers={{
          AuthorizationJWT: token, // <- required by your tenant
        }}
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default DocEditor;
