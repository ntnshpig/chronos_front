import { Fragment } from 'react';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import Main from './Main/Main';

const Layout = (props) => {
  return (
    <Fragment>
        <Header/>
        <Main>{props.children}</Main>
        <Footer/>
    </Fragment>
  );
};

export default Layout;