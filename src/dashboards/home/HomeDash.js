import NewsCarousel from './news/components/NewsCarousel';
import { styled, Box } from '@mui/system';

// Styled Components
const MainContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    alignItems: 'center',
    justifyContent: 'center',
}));

const HomeDash = () => {
    return (
        <MainContainer>
            <NewsCarousel />
        </MainContainer>
    );
};

export default HomeDash;
