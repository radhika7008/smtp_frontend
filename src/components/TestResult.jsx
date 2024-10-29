import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import Images from "./../assets/images/index";
import axios from "axios";
import { API_URL } from "../App";

// Styled Components similar to SmtpUI
const Container = styled(Box)({
  backgroundColor: "#1e1e1e",
  padding: "20px",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  border: "1px solid #444",
  height: "100vh", // Updated to fill full viewport height
  boxSizing: "border-box", // Ensure padding doesn't affect height
});

const InfoBox = styled(Box)({
  display: "flex",
  gap: "10px",
  alignItems: "center",
});

const StatusContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
});

const StatusItem = styled(Box)({
  backgroundColor: "#2a2a2a",
  padding: "10px",
  borderRadius: "8px",
  textAlign: "center",
  border: "1px solid #444",
  flex: 1,
});

const TableContainer = styled(Box)({
  marginTop: "10px",
  "& table": {
    width: "100%",
    color: "#fff",
    borderCollapse: "collapse",
    "& td": {
      padding: "10px",
      border: "1px solid #444",
    },
  },
});

const StyledButton = styled(Button)({
  backgroundColor: "#1e90ff",
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#1c86ee",
  },
});

const ServerStatus = ({ result }) => {
  const [runningIp, setRunningIp] = useState(null); // Initialize with a default value
  const [newConnection, setNewConnection] = useState(2); // Initialize with a default value
  const [refreshIp, setRefreshIp] = useState(); // Initialize with a default value
  console.log(result, "result");
  const fetchData = async (url, params = {}) => {
    try {
      const response = await axios.get(url, { params });
      return response.data; // Return the data from the response
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error for further handling
    }
  };

  useEffect(() => {
    const fetchIps = async () => {
      try {
        const getIps = `${API_URL}ec2/ips?instanceId=i-0b95c95664e6b9cd6`;
        const responseIps = await fetchData(getIps);
        setRunningIp(responseIps);
        setRefreshIp(responseIps?.newIps?.[0]?.PublicIp); // Update the state with the fetched IPs
      } catch (error) {
        console.error("Error fetching IPs:", error);
        // Handle error as needed (e.g., set an error state)
      }
    };

    fetchIps(); // Call the inner async function
  }, []);

  const getNewConnection = async () => {
    const getNewConnection = `${API_URL}ec2/refresh-ips/${newConnection}`;
    await axios.post(getNewConnection);
    const getIps = `${API_URL}ec2/ips?instanceId=i-0b95c95664e6b9cd6`;
    const responseIps = await fetchData(getIps);
    setRunningIp(responseIps);
    setRefreshIp(responseIps?.newIps?.[0]?.PublicIp); // Update the state with the fetched IPs
  };

  const GetRefreshIp = async () => {
    const refreshIp = `${API_URL}ec2/refresh-ip/i-0b95c95664e6b9cd6`;
    const responseIps = await axios.post(refreshIp);
    setRefreshIp(responseIps?.data?.newPublicIp); // Update the state with the fetched IPs
  };
  return (
    <Container>
      <Typography variant="h6" gutterBottom></Typography>
      <InfoBox>
        <Select
          defaultValue="pay"
          size="small"
          sx={{
            minWidth: 150,
            color: "#fff",
            backgroundColor: "#333",
            border: "1px solid #444",
          }}
        >
          <MenuItem value="pay">1 Pay as you go</MenuItem>
          <MenuItem value="pay">2 Pay as you go</MenuItem>
          <MenuItem value="pay">3 Pay as you go</MenuItem>
        </Select>
        <Box
          sx={{
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            padding: "10px 15px",
            border: "1px solid #444",
            borderRadius: "5px",
            color: "#fff",
          }}
        >
          <img src={Images.CartIcon} alt="cart icon" width={20} height={20} />
          {/* Shopping cart icon can be added here */}
        </Box>
      </InfoBox>

      <TableContainer>
        <table>
          <tr>
            <td>IP</td>
            <td>{runningIp?.newIps?.[0]?.PublicIp}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>Running</td>
          </tr>
          <tr>
            <td>Expires</td>
            <td>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body1">
                  {runningIp?.newIps?.length}
                </Typography>
                <img
                  src={Images.DeleteIcon}
                  alt="cart icon"
                  width={20}
                  height={20}
                />
              </Box>
            </td>
          </tr>
        </table>
      </TableContainer>
      <TextField
        error
        id="outlined-error"
        defaultValue="Refresh IP"
        value={refreshIp}
        sx={{
          input: { color: "white" }, // Targets the input text color
        }}
      />

      <StyledButton variant="contained" onClick={() => GetRefreshIp()}>
        Refresh IP
      </StyledButton>
      <Box style={{ height: "12vh" }}></Box>

      <StatusContainer>
        <StatusItem>
          <Typography variant="subtitle1">Smtps</Typography>
          <Typography variant="h4" className="smtps">
            {result.totalSender}
          </Typography>
        </StatusItem>
        <StatusItem>
          <Typography variant="subtitle1">Failed</Typography>
          <Typography variant="h4" className="failed">
            {result.totalSenderFailed}
          </Typography>
          <Typography>Get log</Typography>
        </StatusItem>
        <StatusItem>
          <Typography variant="subtitle1">Sent</Typography>
          <Typography variant="h4" className="sent">
            {result.totalReceiver}
          </Typography>
        </StatusItem>
        <StatusItem>
          <Typography variant="subtitle1">Failed</Typography>
          <Typography variant="h4" className="failed">
            {result.totalReceiverFailed}
          </Typography>
          <Typography>Get log</Typography>
        </StatusItem>
      </StatusContainer>

      <Box sx={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <Box
          sx={{
            flex: 1,
            padding: "10px",
            backgroundColor: "#333",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          Delay in (ms)
        </Box>
        <Box
          sx={{
            flex: 1,
            padding: "10px",
            backgroundColor: "#333",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Typography variant="body1">{result.totalTime}</Typography>
            <img
              src={Images.TImerIcon}
              alt="cart icon"
              width={20}
              height={20}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: "10px", marginTop: "2px" }}>
        <Box
          sx={{
            flex: 1,
            padding: "10px",
            backgroundColor: "#333",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          Connection
        </Box>
        <Box
          sx={{
            flex: 1,
            padding: "10px",
            backgroundColor: "#333",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="number"
                min={1}
                max={10}
                defaultValue={1}
                style={{ width: "50px" }}
                value={newConnection}
                onChange={(e) => setNewConnection(e.target.value)}
              />
              <img
                src={Images.ConnectionIcon}
                alt="cart icon"
                width={20}
                height={20}
              />
            </div>
          </Box>
        </Box>
      </Box>
      <StyledButton variant="contained" onClick={() => getNewConnection()}>
        Get New Server
      </StyledButton>
    </Container>
  );
};

export default ServerStatus;
