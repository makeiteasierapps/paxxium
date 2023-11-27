import { useState, createContext, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
    const { idToken } = useContext(AuthContext);
    const [newsData, setNewsData] = useState([]);
    const [readFilter, setReadFilter] = useState(false);
    const [query, setQuery] = useState('');
    const [slideIndex, setSlideIndex] = useState(0);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const updateNewsData = (updateFunc) =>
        setNewsData((prevNewsData) => updateFunc(prevNewsData));

    const deleteNewsArticle = (newsId) =>
        updateNewsData((prev) => prev.filter((news) => news.id !== newsId));

    const markNewsAsRead = (newsId) =>
        updateNewsData((prev) =>
            prev.map((news) =>
                news.id === newsId ? { ...news, is_read: true } : news
            )
        );

    const setUnreadNewsData = () =>
        updateNewsData((prev) => prev.filter((news) => !news.is_read));

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
    }, [backendUrl, idToken]);

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
        [backendUrl, idToken, query]
    );

    const aiNewsFetch = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/news_topics`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
            });

            if (!response.ok)
                throw new Error('Failed to fetch user news topics');
            const data = await response.json();
            const randIdx = Math.floor(Math.random() * data.news_topics.length);
            fetchNewsData(data.news_topics[randIdx]);
        } catch (error) {
            console.error(error);
        }
    }, [backendUrl, fetchNewsData, idToken]);

    return (
        <NewsContext.Provider
            value={{
                newsData,
                setNewsData,
                query,
                setQuery,
                slideIndex,
                setSlideIndex,
                loadNewsData,
                fetchNewsData,
                aiNewsFetch,
                markNewsAsRead,
                setUnreadNewsData,
                readFilter,
                setReadFilter,
                deleteNewsArticle,
            }}
        >
            {children}
        </NewsContext.Provider>
    );
};
