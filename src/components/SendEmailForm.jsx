import React, {  useRef, useState } from "react";
import Papa from "papaparse"; // Import PapaParse
import "../App.css";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import TextEditor from "./TextEditor";
import Images from "../assets/images";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalContainer from "./ModalContainer";
import { API_URL } from "../App";

const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  backgroundColor: "#2A2A2A",
  padding: "10px",
  borderRadius: "8px",
  color: "#FFFFFF",
});

// Row styles
const Row = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

// Button styles
const CsvButton = styled(Button)({
  textTransform: "none",
  color: "#00BFFF",
});

const RemoveButton = styled(Button)({
  backgroundColor: "#FF6F61",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#FF4B30",
  },
});

const ModaleStyle = styled(Box)({
  width: "300px",
  height: "200px",
});

const SmtpUI = ({ setResult }) => {
  const [smtpReciver, setSmtpReciver] = useState([]);
  const [smtpSender, setSmtpSender] = useState([]);
  const [tags, setTags] = useState(["email", "name", "content","c4","c5","c6"]);
  const [newTags, setNewTags] = useState(
    JSON.parse(localStorage.getItem("tags") || "[]")
  );
  const [isTagInputVisible, setIsTagInputVisible] = useState(false); // State for showing/hiding input field
  const [typeServices, setTypeServices] = useState("GMAIL");
  const [fileType, setFileType] = useState("pdf");
  const [senderName, setSenderName] = useState("");
  const [subject, setSubject] = useState("");
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const [htmlFile, setHtmlFile] = useState("");
  const [check, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [tageStatus, setTageStatus] = useState(false);
  const handleMouseEnter = () => setShowTable(true);
  const handleMouseLeave = () => setShowTable(false);
  const [senderCsv, setSenderCsv] = useState();
  const [receiverCsv, setReceierCsv] = useState();
  const auth=["email","pass"]
  const fileInputRef = useRef(null);
  const fileInputRefOne = useRef(null);
  const StyledButton = styled(Button)({
    backgroundColor: "#1e90ff",
    color: "#fff",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#1c86ee",
    },
    height: "10vh",
    padding: "10px 20px",
    width: "250px",
    fontWeight: "bold",
    fontSize: "19px",
  });
  const validateInputs = () => {
    if (!smtpSender.length) {
      toast.error("Please upload an SMTP file.");
      return false;
    }
    if (!smtpReciver.length) {
      toast.error("Please upload a recipient CSV file.");
      return false;
    }
    if (!senderName.trim()) {
      toast.error("Sender Name is required.");
      return false;
    }
    if (!subject.trim()) {
      toast.error("Subject is required.");
      return false;
    }
    if (!fileName.trim() && check) {
      toast.error("File Name is required when attachments are checked.");
      return false;
    }
    return true;
  };
  const handleRemove = () => {
    setSmtpSender([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input value
    }
  };
  const handleRemoveOne = () => {
    setSmtpReciver([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input value
    }
  };
  const handelSubmit = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    const htmlContent = content;
    const htmlAttachment = htmlFile;
    const blobContent = new Blob([htmlContent], { type: "text/html" });
    const blobAttachment = new Blob([htmlAttachment], { type: "text/html" });
    let fdata = new FormData();
    fdata.append("receiverCsv", receiverCsv);
    fdata.append("senderCsv", senderCsv);
    fdata.append("subject", subject);
    fdata.append("senderName", senderName);
    fdata.append("content", blobContent, "content.html");
    if (check) {
      fdata.append("htmlFile", blobAttachment, "htmlFile.html");
      fdata.append("fileType", fileType);
      fdata.append("fileName", fileName);
    }
    fdata.append("newTags", JSON.stringify(newTags));
    await axios
      .post(`${API_URL}send-email`, fdata)
      .then((response) => {
        // Handle success
        console.log(response,"response")
        setResult(response?.data?.data);
        setSmtpReciver([]);
        setSmtpSender([]);
        setSenderName("");
        setSubject("");
        setFileName("");
        setContent("");
        setHtmlFile("");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error:", error);
      });
  };

  const handelRecipients = (event) => {
    const file = event.target.files[0];
    console.log(file,"file")
    setReceierCsv(file);
    if (file) {
      Papa.parse(file, {
        header: false, // Manually mapping headers
        skipEmptyLines: true,
        complete: (result) => {
          const formattedData = result.data.map((row) => {
            const rowObject = row.reduce((acc, value, index) => {
              acc[`${tags[index]}`] = value; // Maps the value to the corresponding tag
              return acc;
            }, {});
            return rowObject;
          });
          setSmtpReciver(formattedData);
        },
      });
    }
  };

  const handelSmtpCsv = (event) => {
    const file = event.target.files[0];
    setSenderCsv(file)
    if (file) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (result) => {
          const formattedData = result.data.map((row) => {
            return row.reduce((acc, value, index) => {
              acc[`${auth[index]}`] = value;
              return acc;
            }, {});
          });
          setSmtpSender(formattedData);
        },
      });
    }
  };

  const handleAddTag = (data) => {
  console.log(data,"newTags");
    if (data.tagName.trim()) {
      setNewTags([...newTags, data]);
      localStorage.setItem("tags", JSON.stringify([...newTags, data]));
      setOpen(false);
    }
  };
  const handleDelete = (tagToDelete) => {
    const updatedTags = newTags.filter((tag) => tag.tagName !== tagToDelete);
    setNewTags(updatedTags);
    localStorage.setItem("tags", JSON.stringify(updatedTags));
  };

  const handleTagClick = (tag) => {
    const formattedTag = `{{${tag}}} `;
    navigator.clipboard.writeText(formattedTag).then(() => {
      toast.success(`${formattedTag}Copy`);
    });
  };

  return (
    <Box sx={{ padding: "26px", backgroundColor: "#1E1E1E" }}>
      <ToastContainer />
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "70%", marginRight: "10px" }}>
          <Container sx={{ marginBottom: "10px", gap: 0 }}>
            <Row>
              <Box fontWeight="bold">Recipients</Box>
            </Row>
            <Row>
              <div
                className="input-container"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ position: "relative" }}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handelRecipients}
                  style={{ display: "none" }}
                  className="hover-input"
                  id="csv-upload" // Hidden input for file upload
                  ref={fileInputRefOne}
                />

                <label htmlFor="csv-upload">
                  <CsvButton variant="text" component="span">
                    Select CSV
                  </CsvButton>
                </label>
                {/* table  */}
                {/* {smtpReciver.length > 0 && showTable && ( */}
                <table
                  className="hover-table"
                  style={{
                    position: "absolute", // Make table absolutely positioned
                    top: "70%", // Position it just outside the container
                    left: "0",
                    zIndex: 1000,
                    background: "#3c3c3c",
                    border: "1px solid black",
                  }}
                >
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Content</th>
                      <th>c4</th>
                      <th>c5</th>
                      <th>c6</th>
                    </tr>
                  </thead>

                  {smtpReciver.length > 0 && showTable ? (
                    <tbody>
                      {smtpReciver.map((e) => (
                        <tr>
                          <td>{e.email}</td>
                          <td>{e.name}</td>
                          <td>{e.content}</td>
                          <td>{e.c4}</td>
                          <td>{e.c5}</td>
                          <td>{e.c6}</td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td>NO</td>
                        <td>Data</td>
                        <td>Found</td>
                      </tr>
                    </tbody>
                  )}
                </table>
                {/* )} */}
              </div>
              <Typography variant="body2" color="#B0B0B0">
                Total Recipients {smtpReciver.length}{" "}
                {/* Display the number of recipients */}
              </Typography>
              {smtpReciver.length !== 0 && (
                <RemoveButton
                  variant="contained"
                  size="small"
                  onClick={handleRemoveOne}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="subtitle">Remove</Typography>
                    <img
                      src={Images.DeleteIcon}
                      alt="cart icon"
                      width={20}
                      height={20}
                    />
                  </Box>
                </RemoveButton>
              )}
            </Row>
          </Container>

          {/* Repeat of the above Container for demonstration */}
          <Container sx={{ marginBottom: "10px", gap: 0 }}>
            <Row>
              <Box fontWeight="bold">SMTP</Box>
            </Row>
            <Row>
              <Select
                value={typeServices}
                onChange={(e) => {
                  setTypeServices(e.target.value);
                }}
                size="small"
                sx={{
                  minWidth: 120,
                  color: "white",
                  border: "1px solid #444",
                  borderRadius: "5px",
                  backgroundColor: "#333",
                  height: "35px",
                }}
              >
                <MenuItem value="GMAIL">GMAIL</MenuItem>
              </Select>

              <Row>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handelSmtpCsv}
                  style={{ display: "none" }}
                  id="smtp-upload" // Hidden input for file upload
                  ref={fileInputRef}
                />
                <label htmlFor="smtp-upload">
                  <CsvButton variant="text" component="span">
                    Select CSV
                  </CsvButton>
                </label>
                <Typography variant="body2" color="#B0B0B0">
                  Total SMTP {smtpSender.length}{" "}
                  {/* Display the number of recipients */}
                </Typography>
                {smtpSender.length !== 0 && (
                  <RemoveButton
                    variant="contained"
                    size="small"
                    onClick={handleRemove}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="subtitle">Remove</Typography>
                      <img
                        src={Images.DeleteIcon}
                        alt="cart icon"
                        width={20}
                        height={20}
                      />
                    </Box>
                  </RemoveButton>
                )}
              </Row>
            </Row>
          </Container>

          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              backgroundColor: "#2A2A2A",
              borderRadius: "8px",
              color: "#FFFFFF",
              padding: "10px",
              paddingBottom: "20px",
              marginBottom: "5px",
            }}
          >
            {/* Sender Name Field */}
            <TextField
              id="outlined-start-adornment-1"
              variant="filled"
              size="small"
              onChange={(e) => {
                setSenderName(e.target.value);
              }}
              value={senderName}
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "white" }}>
                    <Box sx={{ color: "white" }}>Sender Name :</Box>
                  </InputAdornment>
                ),
                style: { color: "#fff", backgroundColor: "#333" },
              }}
              sx={{
                "& .MuiFilledInput-root": {
                  backgroundColor: "#333",
                },
                width: "100%",
                border: "1px solid #444",
                borderRadius: "5px",
                height: "35px",
              }}
            />

            {/* Another Sender Name Field */}
            <TextField
              id="outlined-start-adornment-2"
              variant="filled"
              size="small"
              onChange={(e) => {
                setSubject(e.target.value);
              }}
              value={subject}
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {" "}
                    <Box sx={{ color: "white" }}>Subject :</Box> :
                  </InputAdornment>
                ),
                style: { color: "#fff", backgroundColor: "#333" },
              }}
              sx={{
                "& .MuiFilledInput-root": {
                  backgroundColor: "#333",
                },
                width: "100%",
                border: "1px solid #444",
                borderRadius: "5px",
                height: "35px",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            width: "30%",
            backgroundColor: "#2C2C2C",
            border: "2px solid #444",
            borderRadius: "10px",
          }}
        >
          <Box sx={{ color: "#FFFFFF", padding: "5px", fontWeight: "bold" }}>
            Tags
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              p: 2,
              borderRadius: "8px",
              backgroundColor: "#3C3C3C",
              maxHeight: "200px",
              overflowY: "scroll",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
            }}
          >
            {tags?.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                variant="outlined"
                onClick={() => handleTagClick(tag)}
                sx={{
                  borderRadius: "5px",
                  fontSize: "12px",
                  borderColor: "#00BFFF",
                  color: "#FFFFFF",
                }}
              />
            ))}

            {newTags?.length > 0 ? (
              <>
                {newTags?.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag.tagName}
                    variant="outlined"
                    onDelete={() => handleDelete(tag.tagName)}
                    onClick={() => handleTagClick(tag.tagName)}
                    sx={{
                      borderRadius: "5px",
                      fontSize: "12px",
                      borderColor: "#00BFFF",
                      color: "#FFFFFF",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </>
            ) : (
              ""
            )}
            <Button
              onClick={() => {
                setIsTagInputVisible(true);
                setOpen(true);
              }}
              sx={{ color: "#00BFFF", textTransform: "none" }}
            >
              {open ? "" : "Add Tags+"}
            </Button>

            {open ? (
              <>
                <ModaleStyle>
                  <ModalContainer
                    setTageStatus={setTageStatus}
                    open={open}
                    handleAddTagData={handleAddTag}
                    setOpen={setOpen}
                    style={{
                      width: "300px",
                      height: "200px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                </ModaleStyle>
              </>
            ) : (
              ""
            )}
          </Box>
        </Box>
      </Box>

      <TextEditor
        content={content}
        setContent={setContent}
        htmlFile={htmlFile}
        setHtmlFile={setHtmlFile}
        check={check}
        setChecked={setChecked}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "5px",
        }}
      >
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            backgroundColor: "#2A2A2A",
            borderRadius: "8px",
            color: "#FFFFFF",
            padding: "10px",
            paddingBottom: "20px",
            marginBottom: "5px",
            width: "70%",
          }}
        >
          {/* Sender Name Field */}
          <TextField
            id="outlined-start-adornment-1"
            variant="filled"
            size="small"
            InputLabelProps={{ style: { color: "#fff" } }}
            onChange={(e) => {
              setFileName(e.target.value);
            }}
            value={fileName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: "white" }}>
                  <Box sx={{ color: "white" }}>File Name :</Box>
                </InputAdornment>
              ),
              style: { color: "#fff", backgroundColor: "#333" },
            }}
            sx={{
              "& .MuiFilledInput-root": {
                backgroundColor: "#333",
              },
              width: "100%",
              border: "1px solid #444",
              borderRadius: "5px",
              height: "35px",
            }}
          />

          {/* Another Sender Name Field */}
          <Select
            value={fileType}
            onChange={(e) => {
              setFileType(e.target.value);
            }}
            size="small"
            sx={{
              minWidth: 120,
              color: "white",
              border: "1px solid #444",
              borderRadius: "5px",
              backgroundColor: "#333",
              height: "35px",
            }}
          >
            <MenuItem value="image">Image</MenuItem>
            <MenuItem value="pdf">Pdf</MenuItem>
          </Select>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StyledButton
            variant="contained"
            onClick={handelSubmit}
            // disabled={loading}
          >
            {loading ? (
            <CircularProgress size={24} className="loading-spinner" />
            ) : (
            "Send Email"
             )} 
          </StyledButton>
        </Box>
      </Box>
    </Box>
  );
};

export default SmtpUI;
