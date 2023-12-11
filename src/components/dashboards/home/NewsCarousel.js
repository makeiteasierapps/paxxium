import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Box, styled } from "@mui/system";
import { useContext, useEffect } from "react";
import Carousel from "react-spring-3d-carousel";
import { NewsContext } from "../../../contexts/NewsContext";
import NewsCard from "./NewsCard";

// Styled Components

const SearchField = styled(TextField)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const SearchButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
}));

const SearchContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(2),
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
    width: "80vw",
    height: "60vh",
    margin: "auto",
    [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
        width: "100vw", // take up 100% of screen width on small screens
    },
}));

const NewsCarousel = () => {
    const {
        newsData,
        query,
        setQuery,
        slideIndex,
        loadNewsData,
        fetchNewsData,
        aiNewsFetch,
        readFilter,
        setReadFilter,
        setUnreadNewsData,
    } = useContext(NewsContext);

    useEffect(() => {
        loadNewsData();
    }, [loadNewsData]);

    const newsSlides = newsData.map((news, index) => ({
        key: news.id,
        content: <NewsCard news={news} index={index} />,
    }));

    return (
        <>
            <Button
                id="ai-fetch-news-button"
                onClick={aiNewsFetch}
                variant="contained"
            >
                Let AI pick your news
            </Button>
            <SearchContainer id="search-container">
                <SearchField
                    id="search-field"
                    label="Search"
                    variant="outlined"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <SearchButton
                    id="search-button"
                    onClick={(event) => {
                        event.preventDefault();
                        fetchNewsData(query);
                    }}
                    variant="contained"
                >
                    Submit
                </SearchButton>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={readFilter}
                            onChange={(event) => {
                                setReadFilter(event.target.checked);
                                if (event.target.checked) {
                                    setUnreadNewsData();
                                } else {
                                    loadNewsData();
                                }
                            }}
                            name="readFilter"
                            color="primary"
                        />
                    }
                    label="Hide read articles"
                />
            </SearchContainer>
            <CarouselContainer id="carousel-container">
                {newsData.length > 0 ? (
                    <Carousel
                        id="carousel"
                        slides={newsSlides}
                        goToSlide={slideIndex}
                    />
                ) : (
                    <p>No news data available</p>
                )}
            </CarouselContainer>
        </>
    );
};

export default NewsCarousel;
