import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import React, { useContext, useEffect } from "react";
import Carousel from "react-spring-3d-carousel";
import { NewsContext } from "../NewsContext";
import NewsCard from "./NewsCard";
import {
    AiSearchButton,
    SearchContainer,
    SearchField,
    SearchButton,
    CarouselContainer,
} from "../styledNewsComponents";

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
            <AiSearchButton
                style={{}}
                id="ai-fetch-news-button"
                onClick={aiNewsFetch}
                variant="contained"
            >
                Let AI pick your news
            </AiSearchButton>
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
