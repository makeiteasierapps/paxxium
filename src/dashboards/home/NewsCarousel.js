import React, { useContext, useEffect } from 'react';
import Carousel from 'react-spring-3d-carousel';
import { NewsContext } from '../../contexts/NewsContext';
import NewsCard from './NewsCard';
import { styled, Box } from '@mui/system';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

// Styled Components

const SearchField = styled(TextField)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const SearchButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
}));

const SearchContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '90%',
    height: '70%',
    [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
        width: '100%', // take up 100% of parent's width on small screens
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
            <Button onClick={aiNewsFetch} variant="contained">
                Let AI pick your news
            </Button>
            <CarouselContainer>
                {newsData.length > 0 ? (
                    <Carousel slides={newsSlides} goToSlide={slideIndex} />
                ) : (
                    <p>No news data available</p>
                )}
            </CarouselContainer>
            <SearchContainer>
                <SearchField
                    label="Search"
                    variant="outlined"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <SearchButton
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
        </>
    );
};

export default NewsCarousel;
