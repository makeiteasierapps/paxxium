import {
    useState,
    createContext,
    useCallback,
    useContext,
    useEffect,
} from 'react';
import { AuthContext } from '../../../auth/AuthContext';
import { SnackbarContext } from '../../../SnackbarContext';

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
    const { idToken } = useContext(AuthContext);
    const { showSnackbar } = useContext(SnackbarContext);
    const [newsData, setNewsData] = useState([]);
    const [readFilter, setReadFilter] = useState(false);
    const [query, setQuery] = useState('');
    const [slideIndex, setSlideIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const backendUrl =
        process.env.NODE_ENV === 'development'
            ? process.env.REACT_APP_NEWS_URL
            : process.env.REACT_APP_BACKEND_URL_PROD;

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
            const response = await fetch(`${backendUrl}/news`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setNewsData(data);
        } catch (error) {
            console.error(error);
            showSnackbar(`Network or fetch error: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl, idToken, showSnackbar]);

    const fetchNewsData = useCallback(
        async (queryParam = query) => {
            try {
                setIsLoading(true);
                const response = await fetch(`${backendUrl}/news/query`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: idToken,
                    },
                    body: JSON.stringify({
                        query: queryParam,
                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const newData = await response.json();
                setNewsData((currentNewsData) => [
                    ...newData,
                    ...currentNewsData,
                ]);
            } catch (error) {
                console.error(error);
                showSnackbar(
                    `Network or fetch error: ${error.message}`,
                    'error'
                );
            } finally {
                setIsLoading(false);
            }
        },
        [idToken, query]
    );

    const aiNewsFetch = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${backendUrl}/news/get-news-topics`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (!data.news_topics) {
                showSnackbar(data.message, 'warning');
                return;
            }
            const randIdx = Math.floor(Math.random() * data.news_topics.length);
            fetchNewsData(data.news_topics[randIdx]);
        } catch (error) {
            console.error(error);
            showSnackbar(`Network or fetch error: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl, fetchNewsData, idToken, showSnackbar]);

    useEffect(() => {
        if (!idToken) return;
        loadNewsData();
    }, [idToken, loadNewsData]);

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
                isLoading,
            }}
        >
            {children}
        </NewsContext.Provider>
    );
};
