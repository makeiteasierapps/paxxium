import { styled } from '@mui/system';
import NavTabs from './NavTabs';

const DashboardWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: `93vh`,
    width: '100%',
    overflow: 'auto',
}));

const Content = styled('div')(({ theme }) => ({
    marginTop: theme.spacing(8),
}));

const MainDash = ({ children }) => {
    return (
        <>
            <NavTabs />
            <DashboardWrapper>
                <Content>{children}</Content>
            </DashboardWrapper>
        </>
    );
};

export default MainDash;
