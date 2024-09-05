import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="15px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD - SRAB" subtitle="Bienvenido al dashboard de SRAB" />

        
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          display="flex" justifyContent="center" alignItems="center"
        >
          <img
            alt="srab-pic"
            width="575px"
            height="425px"
            src={`../../assets/mainPage.jpg`}
            style={{ cursor: "pointer" }}
          />
        </Box>
        
      </Box>
    </Box>
  );
};

export default Dashboard;
