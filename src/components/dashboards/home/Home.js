import { Box, styled } from "@mui/system";
import NewsCarousel from "./NewsCarousel";

// Styled Components
const MainContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
}));

const Home = () => {
    return (
        <MainContainer id="main-container">
            <NewsCarousel />
        </MainContainer>
    );
};

export default Home;
