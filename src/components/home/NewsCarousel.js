import React, { useState, useContext } from 'react';
import Carousel from 'react-spring-3d-carousel';
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { AuthContext } from '../../contexts/AuthContext';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const NewsCarousel = () => {
    const [newsData, setNewsData] = useState([]);
    const [query, setQuery] = useState('');
    const { idToken } = useContext(AuthContext);

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
            setNewsData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleQuerySubmit = (e) => {
        e.preventDefault();
        fetchNewsData();
    };
    const newsSlides = newsData.map((news) => ({
        key: news.id,
        content: (
            <div key={news.id}>
                <h3>{news.title}</h3>
                <p>{news.summary}</p>
                <LinkPreview url={news.url} />
            </div>
        ),
    }));

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >
            <Box
                component="form"
                onSubmit={handleQuerySubmit}
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={3}
            >
                <TextField
                    label="Search"
                    variant="outlined"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    mb={2}
                />
                <Button type="submit" variant="contained">Submit</Button>
            </Box>

            {newsData.length > 0 ? (
                <Carousel slides={newsSlides} />
            ) : (
                <p>No news data available</p>
            )}

        </Box>
    );
};

export default NewsCarousel;
 
