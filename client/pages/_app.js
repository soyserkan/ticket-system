import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header.js';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return <div>
        <Header currentUser={currentUser} />
        <Component {...pageProps} />
    </div>
}

AppComponent.getInitialProps = async appContext => {
    const client = buildClient(appContext.ctx);
    const response = await client.get('api/users/currentuser').catch(function () { });
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    return {
        pageProps,
        currentUser: response ? response.data.currentUser : null
    }
};

export default AppComponent;