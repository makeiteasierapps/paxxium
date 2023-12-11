import NavTabs from "./NavTabs";

const MainDash = ({ children }) => {
    return (
        <>
            <NavTabs />
            {children}
        </>
    );
};

export default MainDash;
