import React, { useState, useContext, useEffect, useCallback } from 'react';
import Carousel from 'react-spring-3d-carousel';
import { AuthContext } from '../../../contexts/AuthContext';
import NewsCard from './NewsCard';
import { styled, Box } from '@mui/system';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SearchIcon from '@mui/icons-material/Search';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const MainContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    alignItems: 'center', // center the content horizontally
    justifyContent: 'center',
}));

const SearchDial = styled(SpeedDial)(({ theme }) => ({
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
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
    const { idToken } = useContext(AuthContext);
    const [slideIndex, setSlideIndex] = useState(0);
    const [open, setOpen] = useState(false);

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
    const fetchNewsData = async () => {
        try {
            const response = await fetch(`${backendUrl}/news`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
                body: JSON.stringify({
                    query: query,
                }),
            });
            if (!response.ok) throw new Error('Failed to fetch news data');
            const data = await response.json();
            console.log(data);
            setNewsData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleQuerySubmit = (e) => {
        e.preventDefault();
        fetchNewsData();
    };
    const newsSlides = newsData.map((news, index) => ({
        key: news.id,
        content: (
            <NewsCard news={news} index={index} setSlideIndex={setSlideIndex} />
        ),
    }));

    useEffect(() => {
        loadNewsData();
    }, [loadNewsData]);

    return (
        <MainContainer>
            <CarouselContainer>
                {newsData.length > 0 ? (
                    <Carousel slides={newsSlides} goToSlide={slideIndex} />
                ) : (
                    <p>No news data available</p>
                )}
                {/* <SearchDial
                    ariaLabel="SpeedDial openIcon example"
                    icon={<SearchIcon />}
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                    open={open}
                    direction="up"
                >
                    <SpeedDialAction
                        key="Search"
                        icon={
                            <>
                                <SearchField
                                    label="Search"
                                    variant="outlined"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <SearchButton
                                    onClick={handleQuerySubmit}
                                    variant="contained"
                                >
                                    Submit
                                </SearchButton>
                            </>
                        }
                    />
                </SearchDial> */}
            </CarouselContainer>
        </MainContainer>
    );
};

export default NewsCarousel;
