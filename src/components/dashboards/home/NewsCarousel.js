import React, { useState, useContext, useEffect, useCallback } from 'react';
import Carousel from 'react-spring-3d-carousel';
import { AuthContext } from '../../../contexts/AuthContext';
import NewsCard from './NewsCard';
import { styled, Box } from '@mui/system';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Styled Components
const MainContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    alignItems: 'center', // center the content horizontally
    justifyContent: 'center',
}));

const SearchField = styled(TextField)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const SearchButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '90%', // take up 90% of parent's width
    flex: 1,
    [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
        width: '100%', // take up 100% of parent's width on small screens
    },
}));

const NewsCarousel = () => {
    const [newsData, setNewsData] = useState([]);
    const [query, setQuery] = useState('');
    const { idToken, uid } = useContext(AuthContext);
    const [slideIndex, setSlideIndex] = useState(0);

    const loadNewsData = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/news/load`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
            });

            if (!response.ok) throw new Error('Failed to load news data');
            const data = await response.json();
            setNewsData(data);
        } catch (error) {}
    }, [idToken]);

    // Takes the query from the search field
    const fetchNewsData = useCallback(
        async (queryParam = query) => {
            try {
                const response = await fetch(`${backendUrl}/news`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: idToken,
                    },
                    body: JSON.stringify({
                        query: queryParam,
                    }),
                });
                if (!response.ok) throw new Error('Failed to fetch news data');
                const data = await response.json();
                setNewsData(data);
            } catch (error) {
                console.error(error);
            }
        },
        [idToken, query]
    );

    const newsSlides = newsData.map((news, index) => ({
        key: news.id,
        content: (
            <NewsCard news={news} index={index} setSlideIndex={setSlideIndex} />
        ),
    }));

    const fetchUserNewsTopics = useCallback(async () => {
        try {
            const response = await fetch(
                `${backendUrl}/user/${uid}/news_topics`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: idToken,
                    },
                }
            );

            if (!response.ok)
                throw new Error('Failed to fetch user news topics');
            const data = await response.json();
            const randIdx = Math.floor(Math.random() * data.news_topics.length);
            setQuery(data.news_topics[randIdx]);
            fetchNewsData(data.news_topics[randIdx]);
        } catch (error) {
            console.error(error);
        }
    }, [fetchNewsData, idToken, uid]);

    useEffect(() => {
        loadNewsData();
    }, [loadNewsData]);

    return (
        <MainContainer>
            <Button onClick={fetchUserNewsTopics} variant="contained">
                Let AI pick your news
            </Button>
            <CarouselContainer>
                {newsData.length > 0 ? (
                    <Carousel slides={newsSlides} goToSlide={slideIndex} />
                ) : (
                    <p>No news data available</p>
                )}
            </CarouselContainer>
            <SearchField
                label="Search"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <SearchButton
                onClick={(event) => {
                    event.preventDefault();
                    fetchNewsData();
                }}
                variant="contained"
            >
                Submit
            </SearchButton>
        </MainContainer>
    );
};

export default NewsCarousel;
