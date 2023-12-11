import { Box, styled } from "@mui/system";
import NewsCarousel from "./news/components/NewsCarousel";

// Styled Components
const MainContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
}));

const HomeDash = () => {
    return (
        <MainContainer id="main-container">
            <NewsCarousel />
        </MainContainer>
    );
};

export default HomeDash;
